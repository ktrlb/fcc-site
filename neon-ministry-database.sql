-- Ministry Database Schema for First Christian Church Granbury
-- Run this script in your Neon SQL editor

-- Create the ministry_categories table
CREATE TABLE ministry_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7), -- Hex color code
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the ministry_skills table
CREATE TABLE ministry_skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the ministry_teams table
CREATE TABLE ministry_teams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20),
    meeting_schedule TEXT,
    location VARCHAR(255),
    skills_needed TEXT[], -- Array of skills
    time_commitment VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the ministry_applications table
CREATE TABLE ministry_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ministry_team_id UUID REFERENCES ministry_teams(id) ON DELETE CASCADE,
    applicant_name VARCHAR(255) NOT NULL,
    applicant_email VARCHAR(255) NOT NULL,
    applicant_phone VARCHAR(20),
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, declined
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the ministry_team_skills junction table
CREATE TABLE ministry_team_skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ministry_team_id UUID REFERENCES ministry_teams(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES ministry_skills(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(ministry_team_id, skill_id)
);

-- Insert default categories
INSERT INTO ministry_categories (name, description, color) VALUES
('Children & Youth', 'Ministries focused on children and young people', '#3B82F6'),
('Worship & Music', 'Music, worship, and technical support ministries', '#8B5CF6'),
('Outreach & Service', 'Community outreach and service ministries', '#10B981'),
('Administration', 'Administrative and support ministries', '#F59E0B'),
('Hospitality', 'Welcome, food service, and hospitality ministries', '#EF4444'),
('Education', 'Teaching, discipleship, and educational ministries', '#06B6D4'),
('Technology', 'Technical support, media, and digital ministries', '#84CC16');

-- Insert common skills
INSERT INTO ministry_skills (name, description) VALUES
('Teaching', 'Ability to teach and explain concepts clearly'),
('Music', 'Musical ability and knowledge'),
('Singing', 'Vocal skills and ability'),
('Instrumental', 'Playing musical instruments'),
('Sound Technology', 'Audio equipment and sound system knowledge'),
('Patience', 'Ability to work with people patiently'),
('Creativity', 'Creative thinking and problem solving'),
('Child Development', 'Understanding of child development stages'),
('Organization', 'Organizational and planning skills'),
('Communication', 'Strong communication abilities'),
('Community Relations', 'Building relationships in the community'),
('Leadership', 'Leadership and team management skills'),
('Administration', 'Administrative and clerical skills'),
('Hospitality', 'Welcoming and serving others'),
('Technology', 'Technical and digital skills'),
('Cooking', 'Food preparation and cooking skills'),
('Driving', 'Valid driver''s license and reliable transportation'),
('Crafting', 'Arts and crafts abilities'),
('Photography', 'Photography and visual skills'),
('Writing', 'Written communication skills');

-- Insert sample ministry teams
INSERT INTO ministry_teams (name, description, category, contact_person, contact_email, contact_phone, meeting_schedule, location, skills_needed, time_commitment) VALUES
('Children''s Ministry', 'Leading Sunday School classes and children''s activities for ages 3-12. Help create engaging, age-appropriate lessons and activities.', 'Children & Youth', 'Sarah Johnson', 'children@fccgranbury.org', '(817) 573-5433', 'Sundays 9:00 AM - 12:00 PM', 'Children''s Wing', ARRAY['Teaching', 'Patience', 'Creativity', 'Child Development'], '3-4 hours per week'),
('Worship Team', 'Lead worship through music, vocals, and technical support. Help create meaningful worship experiences for our congregation.', 'Worship & Music', 'Mike Rodriguez', 'worship@fccgranbury.org', NULL, 'Thursdays 7:00 PM, Sundays 8:00 AM', 'Sanctuary', ARRAY['Music', 'Singing', 'Instrumental', 'Sound Technology'], '4-6 hours per week'),
('Community Outreach', 'Organize and participate in community service projects, food drives, and local mission work.', 'Outreach & Service', 'Linda Chen', 'outreach@fccgranbury.org', '(817) 573-5433', 'First Saturday of each month, 10:00 AM', 'Fellowship Hall', ARRAY['Organization', 'Communication', 'Community Relations'], '2-3 hours per month'),
('Welcome Team', 'Greet visitors and members, provide information, and help people feel welcome at our church.', 'Hospitality', 'Robert Smith', 'welcome@fccgranbury.org', '(817) 573-5433', 'Sundays 8:30 AM - 12:30 PM', 'Main Entrance', ARRAY['Hospitality', 'Communication', 'Patience'], '2-3 hours per week'),
('Tech Team', 'Manage sound, lighting, and video equipment for services and events.', 'Technology', 'David Wilson', 'tech@fccgranbury.org', NULL, 'Sundays 7:30 AM - 12:30 PM', 'Sound Booth', ARRAY['Technology', 'Sound Technology', 'Problem Solving'], '3-4 hours per week'),
('Youth Group Leaders', 'Mentor and lead our youth group for ages 13-18. Plan activities, discussions, and service projects.', 'Children & Youth', 'Jennifer Brown', 'youth@fccgranbury.org', '(817) 573-5433', 'Sundays 6:00 PM - 8:00 PM', 'Youth Room', ARRAY['Leadership', 'Communication', 'Creativity', 'Patience'], '3-4 hours per week');

-- Create indexes for better performance
CREATE INDEX idx_ministry_teams_category ON ministry_teams(category);
CREATE INDEX idx_ministry_teams_active ON ministry_teams(is_active);
CREATE INDEX idx_ministry_teams_name ON ministry_teams(name);
CREATE INDEX idx_ministry_applications_team ON ministry_applications(ministry_team_id);
CREATE INDEX idx_ministry_applications_status ON ministry_applications(status);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_ministry_teams_updated_at 
    BEFORE UPDATE ON ministry_teams 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ministry_applications_updated_at 
    BEFORE UPDATE ON ministry_applications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a view for easy querying of ministry teams with category information
CREATE VIEW ministry_teams_with_categories AS
SELECT 
    mt.*,
    mc.description as category_description,
    mc.color as category_color
FROM ministry_teams mt
LEFT JOIN ministry_categories mc ON mt.category = mc.name
WHERE mt.is_active = true;

-- Create a function to search ministries
CREATE OR REPLACE FUNCTION search_ministries(
    search_term TEXT DEFAULT '',
    category_filter TEXT DEFAULT 'all'
)
RETURNS TABLE (
    id UUID,
    name VARCHAR(255),
    description TEXT,
    category VARCHAR(100),
    contact_person VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    meeting_schedule TEXT,
    location VARCHAR(255),
    skills_needed TEXT[],
    time_commitment VARCHAR(100),
    is_active BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mt.id,
        mt.name,
        mt.description,
        mt.category,
        mt.contact_person,
        mt.contact_email,
        mt.contact_phone,
        mt.meeting_schedule,
        mt.location,
        mt.skills_needed,
        mt.time_commitment,
        mt.is_active,
        mt.created_at,
        mt.updated_at
    FROM ministry_teams mt
    WHERE 
        mt.is_active = true
        AND (category_filter = 'all' OR mt.category = category_filter)
        AND (
            search_term = '' OR
            mt.name ILIKE '%' || search_term || '%' OR
            mt.description ILIKE '%' || search_term || '%' OR
            EXISTS (
                SELECT 1 FROM unnest(mt.skills_needed) AS skill
                WHERE skill ILIKE '%' || search_term || '%'
            )
        )
    ORDER BY mt.name;
END;
$$ LANGUAGE plpgsql;
