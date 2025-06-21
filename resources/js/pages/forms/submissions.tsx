interface Props {
    form: any;
}

export default function FormSubmissions({ form }: Props) {
    console.log('Form Submissions:', form);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="mx-auto min-h-screen max-w-6xl bg-gray-50 p-6 dark:bg-background dark:text-white">
            <header className="mb-8 flex justify-between rounded-xl border border-gray-200 p-6 shadow-sm">
                <h1 className="mb-2 text-3xl font-bold">Datos enviados del formulario "{form.title}"</h1>
                <p className="rounded-lg bg-blue-100 px-4 py-2 font-semibold text-blue-800">
                    {form.submissions.length} {form.submissions.length === 1 ? 'respuesta' : 'respuestas'}
                </p>
            </header>

            {/* Content */}
            {form.submissions.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm dark:bg-background">
                    <div className="mb-4 text-6xl">📭</div>
                    <h3 className="mb-2 text-xl font-semibold text-gray-700">No hay respuestas aún</h3>
                    <p className="text-gray-500">Las respuestas del formulario aparecerán aquí una vez que los usuarios empiecen a enviarlo.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    {form.submissions.map((submission, index) => (
                        <div
                            key={index}
                            className="overflow-hidden rounded-xl border border-sidebar-border shadow-sm transition-shadow duration-200 hover:shadow-md dark:bg-background"
                        >
                            <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r px-6 py-4">
                                <h3 className="flex items-center gap-2 text-lg font-semibold">Respuesta #{index + 1}</h3>
                                {submission.created_at && (
                                    <div className="rounded-full border bg-white px-3 py-1 text-sm text-gray-500">
                                        🕒 {formatDate(submission.created_at)}
                                    </div>
                                )}
                            </div>

                            <div className="p-2">
                                <div className="grid grid-cols-3 gap-4">
                                    {submission.fields.map((field, idx) => (
                                        <div key={idx} className="flex flex-col items-start gap-3 rounded-lg p-2 transition-colors duration-150">
                                            <label className="mb-2 block text-sm font-semibold capitalize">{field.field.label}</label>
                                            {field.field.type === 'file' ? (
                                                <div className="flex items-center gap-2">
                                                    <a
                                                        href={`/files/${encodeURIComponent(field.value)}`}
                                                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        📎 Ver archivo
                                                    </a>
                                                </div>
                                            ) : (
                                                <div className="w-full overflow-hidden rounded border border-gray-200 bg-slate-200 p-0.5 text-black">
                                                    {field.value || <span className="text-gray-400 italic">Sin respuesta</span>}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
