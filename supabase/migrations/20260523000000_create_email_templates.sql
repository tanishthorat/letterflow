-- Enable moddatetime extension for auto-updating updated_at
CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;

-- Create email_templates table
CREATE TABLE IF NOT EXISTS public.email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Ownership / tenancy
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Basic metadata
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'transactional'
        CHECK (category IN ('transactional', 'marketing', 'support', 'billing', 'system', 'other')),
    status TEXT NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'published', 'archived')),

    -- Email content
    subject TEXT NOT NULL DEFAULT '',
    preheader TEXT,

    -- Editor data
    body_design JSONB NOT NULL DEFAULT '{}'::jsonb,
    body_html TEXT NOT NULL DEFAULT '',
    body_text TEXT NOT NULL DEFAULT '',

    -- Dynamic placeholders / merge tags
    placeholders JSONB NOT NULL DEFAULT '[]'::jsonb,

    -- Global style settings for the template/editor
    global_styles JSONB NOT NULL DEFAULT '{}'::jsonb,

    -- Useful flags
    is_responsive BOOLEAN NOT NULL DEFAULT true,

    -- Audit
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Constraints
    CONSTRAINT email_templates_name_length CHECK (char_length(name) BETWEEN 2 AND 120),
    CONSTRAINT email_templates_subject_length CHECK (char_length(subject) BETWEEN 0 AND 200),
    CONSTRAINT email_templates_slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

-- A user should not have duplicate slugs
CREATE UNIQUE INDEX IF NOT EXISTS email_templates_user_id_slug_idx
    ON public.email_templates (user_id, slug);

-- Useful indexes
CREATE INDEX IF NOT EXISTS email_templates_user_id_idx
    ON public.email_templates (user_id);

CREATE INDEX IF NOT EXISTS email_templates_status_idx
    ON public.email_templates (status);

CREATE INDEX IF NOT EXISTS email_templates_category_idx
    ON public.email_templates (category);

CREATE INDEX IF NOT EXISTS email_templates_updated_at_idx
    ON public.email_templates (updated_at DESC);

-- Optional search help
CREATE INDEX IF NOT EXISTS email_templates_search_idx
    ON public.email_templates
    USING gin (
        to_tsvector(
            'simple',
            coalesce(name, '') || ' ' ||
            coalesce(description, '') || ' ' ||
            coalesce(subject, '')
        )
    );

-- Enable Row Level Security
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for email_templates
CREATE POLICY "Users can view their own templates" 
    ON public.email_templates 
    FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own templates" 
    ON public.email_templates 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates" 
    ON public.email_templates 
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own templates" 
    ON public.email_templates 
    FOR DELETE 
    USING (auth.uid() = user_id);

-- Auto-update updated_at on every update
DROP TRIGGER IF EXISTS handle_email_templates_updated_at ON public.email_templates;
CREATE TRIGGER handle_email_templates_updated_at
    BEFORE UPDATE ON public.email_templates
    FOR EACH ROW
    EXECUTE PROCEDURE extensions.moddatetime(updated_at);

-- Create test_email_logs table
CREATE TABLE IF NOT EXISTS public.test_email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES public.email_templates(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    recipient_email TEXT NOT NULL,
    provider TEXT NOT NULL DEFAULT 'resend',
    provider_message_id TEXT,
    status TEXT NOT NULL DEFAULT 'queued'
        CHECK (status IN ('queued', 'sent', 'failed')),
    error_message TEXT,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security for logs
ALTER TABLE public.test_email_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for logs
CREATE POLICY "Users can view their own email logs"
    ON public.test_email_logs
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own email logs"
    ON public.test_email_logs
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
