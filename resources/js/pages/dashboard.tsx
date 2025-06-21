import { useModalContext } from '@/components/Modal/context/useModalContext';
import { Modal } from '@/components/Modal/Modal';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { useIsMobile } from '@/hooks/use-mobile';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Form } from '@/types/Form';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import CreateForm from './forms/create';
import ShowForm from './forms/show';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Forms',
        href: '/dashboard/forms',
    },
];

interface Props {
    forms: {
        data: Form[];
        links: { url: string | null; label: string; active: boolean }[];
        per_page: number;
        // meta: {
        //     current_page: number;
        //     last_page: number;
        //     total: number;
        // };
    };
}

export default function Dashboard({ forms }: Props) {
    const { flash } = usePage().props;
    const [successMessage, setSuccessMessage] = useState<string>(flash.success || '');
    const { setState, state } = useModalContext();
    const isMobile = useIsMobile();
    const [form, setSelectedForm] = useState<Form | null>(null);
    const [modal, setModal] = useState<string | null>(null);

    useEffect(() => {
        if (flash.success) {
            setSuccessMessage(flash.success);

            const timeout = setTimeout(() => {
                setSuccessMessage('');
            }, 4000); // 4 segundos

            return () => clearTimeout(timeout);
        }
    }, [flash.success]);

    const openModal = (form: Form) => {
        setSelectedForm(form);
        if (isMobile) {
            setState(true);
            setModal('show');
        }
    };

    const openCreateFormModal = () => {
        setState(true);
        setModal('create');
    };

    const handlePageChange = (url: string) => {
        router.get(url, {}, { preserveScroll: true, preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            {successMessage && (
                <div className="fixed top-5 right-60 z-50 mb-4 rounded bg-green-100 px-4 py-2 text-green-800 shadow">{successMessage}</div>
            )}
            <div className="grid h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 md:grid-cols-2">
                <div className="relative overflow-hidden dark:border-sidebar-border">
                    <header className="flex items-center justify-between pb-2">
                        <h1 className="flex-1">Forms</h1>
                        <Button onClick={openCreateFormModal} className="cursor-pointer rounded px-3 py-1.5">
                            Crear Formulario
                        </Button>
                    </header>
                    <div className="space-y-4">
                        {forms.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-4 py-10 text-center text-gray-500">
                                <p className="text-lg font-medium">Aún no tienes formularios.</p>
                                <p className="max-w-md text-sm text-gray-400">
                                    Para comenzar, crea un formulario nuevo usando el botón “Crear Formulario”. Luego podrás seleccionarlo para ver
                                    detalles o compartirlo.
                                </p>
                            </div>
                        ) : (
                            <ul className="space-y-2">
                                {forms.data.map((form) => (
                                    <li key={form.id} className="flex flex-col justify-between rounded border px-4 py-2 lg:flex-row lg:items-center">
                                        <Button
                                            variant={'ghost'}
                                            onClick={() => openModal(form)}
                                            className="flex cursor-pointer items-center justify-between rounded px-0 py-2"
                                        >
                                            <h2 className="text-lg font-semibold capitalize">{form.title}</h2>
                                            <p className="text-sm text-gray-500">Creado el: {new Date(form.created_at).toLocaleDateString()}</p>
                                        </Button>
                                        <Link href={route('forms.submissions', form.id)} className="text-sm text-blue-600 hover:underline">
                                            Ver respuestas
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {forms.data.length > forms.per_page && (
                            <Pagination className="w-auto cursor-pointer">
                                <PaginationContent>
                                    {forms.links
                                        .filter((link) => !isNaN(Number(link.label)))
                                        .map((link, i) => (
                                            <PaginationItem key={i}>
                                                {link.url ? (
                                                    <PaginationLink
                                                        onClick={() => handlePageChange(link.url!)}
                                                        isActive={link.active}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                ) : (
                                                    <PaginationLink
                                                        isActive={false}
                                                        className="cursor-not-allowed opacity-50"
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                )}
                                            </PaginationItem>
                                        ))}
                                </PaginationContent>
                            </Pagination>
                        )}
                    </div>
                </div>

                <div className="hidden md:block">
                    {form ? (
                        <ShowForm form={form} />
                    ) : (
                        <div className="flex items-center justify-center">
                            <p className="text-lg text-gray-500">Selecciona un formulario para ver sus detalles.</p>
                        </div>
                    )}
                </div>
            </div>
            {modal === 'show' && isMobile && form && (
                <Modal position="right">
                    <ShowForm form={form} />
                </Modal>
            )}

            {modal === 'create' && state && (
                <Modal position="center">
                    <CreateForm />
                </Modal>
            )}
        </AppLayout>
    );
}
