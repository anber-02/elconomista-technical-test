<?php

namespace App\Filament\Resources;

use App\Filament\Resources\FormSubmissionResource\Pages;
use App\Filament\Resources\FormSubmissionResource\RelationManagers;
use App\Models\FormField;
use App\Models\FormFieldOption;
use App\Models\FormSubmission;
use App\Models\User;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Infolists\Components\Grid;
use Filament\Infolists\Components\Group;
use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\RepeatableEntry;
use Filament\Infolists\Components\Section;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Infolist;
use Filament\Resources\Resource;
use Filament\Support\Enums\FontWeight;
use Filament\Tables;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Str;

class FormSubmissionResource extends Resource
{
    protected static ?string $model = FormSubmission::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';
    protected static ?string $navigationLabel = 'Formularios';
    protected static ?string $modelLabel = 'Formularios';
    protected static ?string $navigationGroup = 'Formularios';

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->label('ID')
                    ->numeric()
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('form.title')
                    ->label('Formulario')
                    ->searchable()
                    ->sortable()
                    ->extraAttributes([
                        'class' => 'capitalize'
                    ]),
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Usuario')
                    ->searchable()
                    ->sortable()
                    ->extraAttributes([
                        'class' => 'capitalize'
                    ]),
                Tables\Columns\TextColumn::make('created_at')
                    ->label("Fecha de envio")
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\IconColumn::make('hasFiles')
                    ->label('Archivos')
                    ->getStateUsing(fn(FormSubmission $record) => $record->hasFiles())
                    ->icon(fn(bool $state) => $state ? 'heroicon-o-check-circle' : 'heroicon-o-x-circle')
                    ->color(fn(bool $state) => $state ? 'success' : 'danger')
                    ->tooltip(fn(bool $state) => $state ? 'Tiene archivos adjuntos' : 'No tiene archivos adjuntos')
            ])->defaultSort('id', 'desc')
            ->filters([
                Filter::make('created_at')
                    ->form([
                        DatePicker::make('from')
                            ->label('Desde')
                            ->placeholder('Fecha de inicio'),
                        DatePicker::make('to')
                            ->label('Hasta')
                            ->placeholder('Fecha de fin'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['from'],
                                fn(Builder $query, $date): Builder => $query->whereDate('created_at', '>=', $date),
                            )
                            ->when(
                                $data['to'],
                                fn(Builder $query, $date): Builder => $query->whereDate('created_at', '<=', $date),
                            );
                    })
                    ->indicateUsing(function (array $data): array {
                        $indicators = [];
                        if ($data['from'] ?? null) {
                            $indicators['from'] = 'Enviado desde ' . \Carbon\Carbon::parse($data['from'])->toFormattedDateString();
                        }
                        if ($data['to'] ?? null) {
                            $indicators['to'] = 'Enviado hasta ' . \Carbon\Carbon::parse($data['to'])->toFormattedDateString();
                        }
                        return $indicators;
                    }),

                Filter::make('user')
                    ->form([
                        Select::make('user_id')
                            ->label('Usuario')
                            ->placeholder('Selecciona un usuario')
                            ->options(User::pluck('name', 'id')->toArray())
                            ->searchable(),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query->when(
                            $data['user_id'],
                            fn(Builder $query, $id): Builder => $query->where('user_id', $id),
                        );
                    })
                    ->indicateUsing(function (array $data): array {
                        if ($data['user_id'] ?? null) {
                            $user = User::find($data['user_id']);
                            return ['user_id' => 'Usuario: ' . ($user ? $user->name : 'Desconocido')];
                        }
                        return [];
                    }),

                Filter::make('has_attachments')
                    ->label('Archivos Adjuntos')
                    ->query(function (Builder $query): Builder {
                        return $query->whereHas('fields', function (Builder $query) {
                            $query->where('value', '!=', null)->whereHas('field', function (Builder $query) {
                                $query->where('type', 'file');
                            });
                        });
                    })
                    ->toggle()
                    ->default(false),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function infolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->schema([
                // Sección de información general
                Section::make('Información General')
                    ->description('Detalles del formulario y usuario')
                    ->schema([
                        Grid::make(3)
                            ->schema([
                                TextEntry::make('form.title')
                                    ->label('Formulario')
                                    ->icon('heroicon-o-document-text')
                                    ->weight(FontWeight::Bold)
                                    ->color('primary'),

                                TextEntry::make('user.name')
                                    ->label('Usuario')
                                    ->icon('heroicon-o-user')
                                    ->badge()
                                    ->color('success'),

                                TextEntry::make('created_at')
                                    ->label('Fecha de respuesta')
                                    ->icon('heroicon-o-calendar')
                                    ->dateTime('d/m/Y H:i:s')
                                    ->color('gray'),
                            ]),

                    ])
                    ->collapsible()
                    ->persistCollapsed(),

                // Sección de respuestas
                Section::make('Respuestas del Formulario')
                    ->description('Todas las respuestas proporcionadas por el usuario')
                    ->schema([
                        RepeatableEntry::make('fields')
                            ->label('')
                            ->contained(false)
                            ->grid(3)
                            ->schema([
                                Grid::make(1)
                                    ->schema([
                                        // Encabezado del campo
                                        Group::make([
                                            TextEntry::make('field.label')
                                                ->label('')
                                                ->weight(FontWeight::Bold)
                                                ->size(TextEntry\TextEntrySize::Large)
                                                ->color('primary')
                                                ->formatStateUsing(
                                                    fn($state, $record) =>
                                                    $state . ' (' . ucfirst($record->field->type) . ')'
                                                )
                                                ->extraAttributes([
                                                    'class' => 'capitalize'
                                                ]),
                                        ]),

                                        Group::make([
                                            // Para campos de texto simples
                                            TextEntry::make('value')
                                                ->label('')
                                                ->visible(fn($record) => in_array($record->field->type, ['text', 'number', 'email', 'url', 'date', 'time']))
                                                ->placeholder('Sin respuesta')
                                                ->copyable()
                                                ->badge(fn($record) => $record->field->type === 'email')
                                                ->color(fn($record) => match ($record->field->type) {
                                                    'email' => 'info',
                                                    'url' => 'warning',
                                                    'date', 'time' => 'success',
                                                    default => 'gray'
                                                })
                                                ->formatStateUsing(function ($state, $record) {
                                                    if ($record->field->type === 'url' && $state) {
                                                        return $state;
                                                    }
                                                    return $state;
                                                }),

                                            // Para textarea
                                            TextEntry::make('value')
                                                ->label('')
                                                ->visible(fn($record) => $record->field->type === 'textarea')
                                                ->placeholder('Sin respuesta')
                                                ->html()
                                                ->copyable()
                                                ->formatStateUsing(fn($state) => nl2br(e($state))),


                                            // Para imágenes
                                            ImageEntry::make('value')
                                                ->label('')
                                                ->visible(function ($record) {
                                                    if ($record->field->type !== 'file' || !$record->value) {
                                                        return false;
                                                    }

                                                    $extension = strtolower(pathinfo($record->value, PATHINFO_EXTENSION));
                                                    return in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp']);
                                                })
                                                ->getStateUsing(function ($record) {
                                                    if ($record->value && file_exists(storage_path('app/private/' . $record->value))) {
                                                        return route('ver-archivo', ['path' => $record->value]);
                                                    }
                                                    return null;
                                                })
                                                ->size(200)
                                                ->square()
                                                ->extraAttributes(['class' => 'rounded-lg shadow-sm object-cover'])
                                                ->defaultImageUrl('/images/no-image.png'),

                                            // Para archivos
                                            TextEntry::make('value')
                                                ->label('')
                                                ->visible(function ($record) {
                                                    if ($record->field->type !== 'file' || !$record->value) {
                                                        return false;
                                                    }

                                                    $extension = strtolower(pathinfo($record->value, PATHINFO_EXTENSION));
                                                    return !in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp']);
                                                })
                                                ->formatStateUsing(function ($state, $record) {
                                                    if (!$state) return 'Sin archivo';

                                                    $fileName = basename($state);
                                                    $fileUrl = route('ver-archivo', ['path' => $state]);
                                                    $fileExtension = pathinfo($fileName, PATHINFO_EXTENSION);

                                                    $icon = match (strtolower($fileExtension)) {
                                                        'pdf' => '📄',
                                                        'doc', 'docx' => '📝',
                                                        'xls', 'xlsx' => '📊',
                                                        'zip', 'rar' => '🗜️',
                                                        default => '📎'
                                                    };

                                                    return "{$icon}" . Str::limit($fileName, 20);
                                                })
                                                ->url(function ($record) {
                                                    if ($record->value) {
                                                        return route('ver-archivo', ['path' => $record->value]);
                                                    }
                                                    return null;
                                                }, true)
                                                ->color('info')
                                                ->weight(FontWeight::Medium),

                                            // Para opciones seleccionadas (radio, select)
                                            TextEntry::make('option.value')
                                                ->label('')
                                                ->visible(fn($record) => in_array($record->field->type, ['radio', 'select']))
                                                ->badge()
                                                ->color('success')
                                                ->icon('heroicon-o-check-circle')
                                                ->placeholder('Sin selección'),
                                        ])
                                            ->extraAttributes([
                                                'class' => 'p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200'
                                            ]),
                                    ])
                            ])
                            ->extraAttributes(['class' => 'space-y-4']),
                    ])
                    ->collapsible()
                    ->persistCollapsed(false),
            ]);
    }


    public static function getRelations(): array
    {
        return [
            //
            // FormField::class,
            // FormFieldOption::class
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListFormSubmissions::route('/'),
            // 'create' => Pages\CreateFormSubmission::route('/create'),
            // 'view' => Pages\ViewFormSubmission::route('/{record}'),
            // 'edit' => Pages\EditFormSubmission::route('/{record}/edit'),
        ];
    }
    // deshabilitar la posibilidad de crear formularios para el admin
    public static function canCreate(): bool
    {
        return  false;
    }
}
