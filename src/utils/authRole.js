export function resolveUserRole(user) {
    if (!user) return 'user';
    if (user.role) return normalizeRole(user.role);
    
    return normalizeRole(
        user.user_metadata?.nuur_role ||
        user.user_metadata?.role ||
        user.app_metadata?.nuur_role ||
        user.app_metadata?.role ||
        'user'
    );
}

export function canAccessEcommerce(role) {
    return role === 'user' || role === 'admin';
}
