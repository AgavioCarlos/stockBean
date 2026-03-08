import React from 'react';
import { usePermissions } from '../hooks/useAuth';

interface WithPermissionProps {
    screen: string;
    action: 'view' | 'create' | 'read' | 'update' | 'delete' | 'export';
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export const WithPermission: React.FC<WithPermissionProps> = ({
    screen,
    action,
    children,
    fallback = null
}) => {
    const permissions = usePermissions(screen);

    const actionMap: Record<string, boolean> = {
        'view': permissions.canView,
        'create': permissions.canCreate,
        'read': permissions.canRead,
        'update': permissions.canUpdate,
        'delete': permissions.canDelete,
        'export': permissions.canExport,
    };

    const hasPermission = actionMap[action];

    if (!hasPermission) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};
