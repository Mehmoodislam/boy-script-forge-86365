"use client";

import { useParams } from "next/navigation";
import JPGCompress from "@/components/tools/JPGCompress";

export default function TargetSizePage() {
    const params = useParams();
    const size = params.size as string;

    return <JPGCompress targetSize={size} />;
}
