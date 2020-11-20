export default function (messagemorg, roleName) {
    return (messagemorg).roles.cache.some(r => r.name == roleName);
}