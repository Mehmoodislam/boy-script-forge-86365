import JPGCompress from "@/components/tools/JPGCompress";

export default function JPGCompressPage({ targetSize }: { targetSize?: string }) {
    return <JPGCompress targetSize={targetSize} />;
}
