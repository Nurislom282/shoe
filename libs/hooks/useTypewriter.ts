import { useState, useEffect } from 'react';

export const useTypewriter = (text: string, speed: number = 50) => {
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        setDisplayText(''); // Reset on text change
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayText((prev) => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);

        return () => clearInterval(timer);
    }, [text, speed]);

    return displayText;
};

export default useTypewriter;
