CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (name = btrim(name) AND char_length(name) BETWEEN 1 AND 100),
  email TEXT NOT NULL CHECK (email = btrim(email) AND char_length(email) <= 255 AND email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  subject TEXT NOT NULL CHECK (subject = btrim(subject) AND char_length(subject) BETWEEN 1 AND 200),
  message TEXT NOT NULL CHECK (message = btrim(message) AND char_length(message) BETWEEN 10 AND 5000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_submissions TO anon, authenticated;
GRANT SELECT ON public.contact_submissions TO authenticated;
GRANT ALL ON public.contact_submissions TO service_role;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors can submit contact messages" ON public.contact_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Signed-in admins can view contact messages" ON public.contact_submissions FOR SELECT TO authenticated USING (true);