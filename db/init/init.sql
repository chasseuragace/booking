CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    start_at TIMESTAMP NOT NULL,  -- Use TIMESTAMP (without time zone)
    end_at TIMESTAMP NOT NULL,    -- Use TIMESTAMP (without time zone)
    completed_at TIMESTAMP,
    booking_info JSONB,
    
    -- Use tsrange instead of tstzrange
    EXCLUDE USING GIST (
        entity_id WITH =,               -- Ensure the same entity is involved
        tsrange(start_at, end_at) WITH &&
    )
);
