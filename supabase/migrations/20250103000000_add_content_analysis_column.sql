-- Add content_analysis column to content_history table
ALTER TABLE content_history ADD COLUMN IF NOT EXISTS content_analysis JSONB;

-- Add improvement_tips column for future use
ALTER TABLE content_history ADD COLUMN IF NOT EXISTS improvement_tips JSONB;

-- Update Row Level Security policies if they don't exist
DO $$
BEGIN
    -- Enable RLS
    ALTER TABLE content_history ENABLE ROW LEVEL SECURITY;
    
    -- Create policies if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'content_history' 
        AND policyname = 'Users can view their own content'
    ) THEN
        CREATE POLICY "Users can view their own content" 
        ON content_history
        FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'content_history' 
        AND policyname = 'Users can insert their own content'
    ) THEN
        CREATE POLICY "Users can insert their own content"
        ON content_history
        FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'content_history' 
        AND policyname = 'Users can update their own content'
    ) THEN
        CREATE POLICY "Users can update their own content"
        ON content_history
        FOR UPDATE USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'content_history' 
        AND policyname = 'Users can delete their own content'
    ) THEN
        CREATE POLICY "Users can delete their own content"
        ON content_history
        FOR DELETE USING (auth.uid() = user_id);
    END IF;
END
$$;
