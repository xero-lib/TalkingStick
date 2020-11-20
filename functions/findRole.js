export default function (messagemorg, roleName) {
    return (messagemorg).roles.cache.find(r => r.name == roleName);
}