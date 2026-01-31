// src/hooks/use3DTilt.ts
import { useMotionValue, useSpring, useTransform } from "framer-motion";
import React from "react";

export function use3DTilt(ref: React.RefObject<HTMLElement>, options = { intensity: 15 }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 50, mass: 0.5 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 50, mass: 0.5 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], [options.intensity, -options.intensity]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-options.intensity, options.intensity]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        
        const width = rect.width;
        const height = rect.height;

        const offsetX = e.clientX - rect.left - width / 2;
        const offsetY = e.clientY - rect.top - height / 2;

        x.set(offsetX / width);
        y.set(offsetY / height);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return { rotateX, rotateY, handleMouseMove, handleMouseLeave };
}
