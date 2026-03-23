import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../Layouts/MainLayout';
import Breadcrumb from '../Breadcrumb';
import { FaHome } from 'react-icons/fa';

interface BreadcrumbItem {
    label: string;
    icon?: ReactNode;
    onClick?: () => void;
}

interface PageContainerProps {
    /** Items del breadcrumb. Si no se provee, muestra Dashboard por defecto */
    breadcrumbs?: BreadcrumbItem[];
    /** Función personalizada para el botón de volver. Default: navigate(-1) */
    onBack?: () => void;
    /** Clase adicional para el contenedor principal */
    className?: string;
    children: ReactNode;
}

/**
 * Contenedor de página estándar que incluye Layout Principal y Breadcrumbs.
 * Wrappea automáticamente el contenido con los estilos de página consistentes.
 *
 * @example
 * <PageContainer
 *   breadcrumbs={[
 *     { label: 'Catálogos', onClick: () => navigate('/catalogos') },
 *     { label: 'Productos' }
 *   ]}
 * >
 *   <ProductosContent />
 * </PageContainer>
 */
export const PageContainer: React.FC<PageContainerProps> = ({
    breadcrumbs,
    onBack,
    className = '',
    children,
}) => {
    const navigate = useNavigate();

    const defaultBreadcrumbs: BreadcrumbItem[] = [
        {
            label: "",
            icon: <FaHome />,
            onClick: () => navigate("/dashboard"),
        }
    ];

    const currentBreadcrumbs = breadcrumbs || defaultBreadcrumbs;

    return (
        <MainLayout>
            <div className={`flex flex-col min-h-screen ${className}`}>
                <Breadcrumb
                    items={currentBreadcrumbs}
                    onBack={onBack || (() => navigate(-1))}
                />
                
                <div className="flex-1 px-4 lg:px-8 pb-10 animate-in fade-in slide-in-from-bottom-4">
                    {children}
                </div>
            </div>
        </MainLayout>
    );
};
