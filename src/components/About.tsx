const About = () => {
  return (
    <section id="about" className="py-24 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="
            font-bold
            text-2xl sm:text-3xl md:text-4xl lg:text-5xl
            leading-tight
            break-words
            text-center
          ">
            Simple, Private Image Tools for{" "}
            <span className="
              bg-gradient-to-r from-primary to-primary-glow
              bg-clip-text text-transparent
            ">
              Everyday Use
            </span>
          </h2>

          <div className="space-y-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
            <p>
              <span className="font-semibold text-foreground">FreeImagePrompt</span> is a free collection of online image tools built for the small, everyday moments when you just need a photo fixed quickly — a job application that rejects anything over 50KB, an old website that won't accept a HEIC photo from your iPhone, or a PNG graphic that's too heavy for your site to load fast. Instead of downloading an app or learning design software, you can open a tool here, drop in your image, and have a working file back in a few seconds.
            </p>

            <p>
              What sets these tools apart from most free converters online is where the work actually happens. Rather than uploading your photo to a remote server, every tool runs directly inside your own browser using your device's processing power. Your image never leaves your computer or phone, which means there's nothing to wait on, nothing stored anywhere, and nothing to worry about if the photo is personal or sensitive. It also means the tools keep working reliably even on a weak or unstable internet connection, since there's no large file being sent back and forth.
            </p>

            <p>
              The tool library covers the two things people search for most: shrinking a photo to fit a strict size limit, and converting between formats like JPG, PNG, WebP, and HEIC. Compression tools are built around the exact KB sizes that forms and portals commonly demand — 5KB, 20KB, and 50KB — instead of a vague "compress" slider that leaves you guessing. Conversion tools handle the format mismatches people run into daily, like an iPhone saving photos as HEIC by default, or a website that only accepts JPG and rejects a WebP image outright.
            </p>

            <p>
              New tools are added based on what people are actually searching for, so if a specific size or format isn't covered yet, it usually will be soon.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
