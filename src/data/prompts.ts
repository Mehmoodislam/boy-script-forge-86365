import boy1 from "@/assets/boy1.jpg";
import boy2 from "@/assets/boy2.jpg";
import boy3 from "@/assets/boy3.jpg";
import boy4 from "@/assets/boy4.jpg";
import boy5 from "@/assets/boy5.jpg";
import boy6 from "@/assets/boy6.jpg";
import boy7 from "@/assets/boy7.jpg";
import boy8 from "@/assets/boy8.jpg";
import boy9 from "@/assets/boy9.jpg";
import boy10 from "@/assets/boy10.jpg";
import boy11 from "@/assets/boy11.jpg";
import boy12 from "@/assets/boy12.jpg";

export interface PromptData {
  id: string;
  image: string;
  title: string;
  prompt: string;
  tags: string[];
}

export const promptsData: PromptData[] = [
  {
    id: "1",
    image: boy1,
    title: "Modern Trendsetter",
    prompt: "A portrait of a stylish handsome young man with modern hairstyle, confident expression, wearing trendy casual outfit, professional studio lighting, contemporary fashion style, ultra high resolution, detailed facial features, sharp focus",
    tags: ["Modern", "Casual", "Studio"]
  },
  {
    id: "2",
    image: boy2,
    title: "Urban Athlete",
    prompt: "A portrait of a handsome young man with athletic build, sharp jawline, wearing stylish streetwear, urban background, cinematic lighting, modern aesthetic, ultra high resolution, professional photography",
    tags: ["Athletic", "Streetwear", "Urban"]
  },
  {
    id: "3",
    image: boy3,
    title: "Elegant Charm",
    prompt: "A portrait of a charming young man with perfectly styled hair, warm smile, wearing elegant casual attire, soft natural lighting, sophisticated style, ultra high resolution, warm color grading",
    tags: ["Elegant", "Sophisticated", "Natural"]
  },
  {
    id: "4",
    image: boy4,
    title: "Fashion Forward",
    prompt: "A portrait of a handsome young man with trendy outfit, confident pose, modern urban fashion, dramatic lighting, contemporary style, ultra high resolution, editorial photography",
    tags: ["Fashion", "Dramatic", "Editorial"]
  },
  {
    id: "5",
    image: boy5,
    title: "Artistic Expression",
    prompt: "A portrait of a stylish young man with artistic look, creative expression, fashionable clothing, professional photography, modern aesthetic, ultra high resolution, creative lighting",
    tags: ["Artistic", "Creative", "Modern"]
  },
  {
    id: "6",
    image: boy6,
    title: "Casual Elegance",
    prompt: "A portrait of a handsome young man with casual elegance, natural charm, contemporary fashion, beautiful lighting, modern portrait style, ultra high resolution, professional quality",
    tags: ["Casual", "Natural", "Professional"]
  },
  {
    id: "7",
    image: boy7,
    title: "Best Friend Moment",
    prompt: "A portrait of a handsome young man with a golden retriever dog, warm sunset lighting, outdoor setting, friendly smile, wearing burgundy casual jacket, professional photography, cinematic color grading, ultra high resolution, detailed, shallow depth of field",
    tags: ["Pet", "Sunset", "Outdoor"]
  },
  {
    id: "8",
    image: boy8,
    title: "Freedom Jump",
    prompt: "A portrait of a stylish young man jumping in mid-air in a green field, energetic pose, outdoor photography, natural daylight, wearing blue casual outfit, dynamic action shot, cinematic style, ultra high resolution, professional quality",
    tags: ["Action", "Dynamic", "Outdoor"]
  },
  {
    id: "9",
    image: boy9,
    title: "Fire Magic",
    prompt: "A portrait of a handsome young man with fire effects in hands, dramatic lighting, dark background, magical realism style, cinematic photography, intense expression, ultra high resolution, creative visual effects",
    tags: ["Dramatic", "Effects", "Creative"]
  },
  {
    id: "10",
    image: boy10,
    title: "Sports Lifestyle",
    prompt: "A portrait of a stylish young man in sports jersey number 23, casual relaxed pose, sunset golden hour lighting, outdoor setting, confident expression, athletic style, cinematic photography, ultra high resolution, warm color tones",
    tags: ["Sports", "Athletic", "Golden Hour"]
  },
  {
    id: "11",
    image: boy11,
    title: "Adventure Spirit",
    prompt: "A portrait of a handsome young man near camping tent in forest, outdoor adventure style, natural lighting, wearing green casual outfit, peaceful expression, nature photography, cinematic aesthetic, ultra high resolution, professional quality",
    tags: ["Adventure", "Camping", "Nature"]
  },
  {
    id: "12",
    image: boy12,
    title: "Epic Journey",
    prompt: "A portrait of a stylish young man with dramatic waterfall background, adventure photography, wearing dark maroon jacket, powerful natural setting, cinematic lighting, epic composition, ultra high resolution, professional outdoor photography",
    tags: ["Epic", "Waterfall", "Adventure"]
  }
];
