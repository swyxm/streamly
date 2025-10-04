INSERT INTO roles (name) VALUES ('ROLE_USER') ON CONFLICT (name) DO NOTHING;
INSERT INTO roles (name) VALUES ('ROLE_MODERATOR') ON CONFLICT (name) DO NOTHING;
INSERT INTO roles (name) VALUES ('ROLE_ADMIN') ON CONFLICT (name) DO NOTHING;


INSERT INTO users (
    username, 
    email, 
    password, 
    display_name, 
    bio, 
    avatar_url, 
    is_verified, 
    created_at, 
    updated_at,
    is_active
) VALUES (
    'admin', 
    'admin@example.com', 
    '$2a$10$XURPShQNCsLjp1ESc2laoObo9QZDhxz73hJPaEv7/cBha4pk0AgP.',
    'Administrator',
    'System Administrator',
    'https://example.com/avatar.png',
    true,
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP,
    true
) ON CONFLICT (username) DO NOTHING;

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.username = 'admin' AND r.name = 'ROLE_ADMIN'
ON CONFLICT (user_id, role_id) DO NOTHING;