import React, {useEffect, useState} from "react";
import useTextSelection from "~/hooks/useTextSelection";

function prompt(context: string, user_input: string) {
    return `Answer the QUESTION using the CONTEXT given. If there is insufficient context, make a best effort but with a disclaimer.
QUESTION: ${user_input}
CONTEXT: ${context}
ANSWER:`
}

function ChatGPT({matches, ...props}) {
    const [chatlog, setChatlog] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const selectedText = useTextSelection();
    const text = window._outline_editor.getPlainText();

    let context = selectedText.trim().length > 0 ? selectedText : text;
    context = context.replace(/\s+/g, ' ');
    if (context.length > (4096 * 4)) {
        context = context.substring(0, 4096 * 4);
    }

    useEffect(() => {
        const fetchData = async () => {
            // Ensure there's a message to send
            const message = matches[0];
            if (!message) {
                setError('No message provided');
                return;
            }

            setLoading(true);
            setError(null);

            try {
                let full_prompt = prompt(context, message);
                console.log("Context", context);
                const response = await fetch("http://localhost:9999/chat", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({message: full_prompt}),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const decoder = new TextDecoder();
                const reader = response.body.getReader();
                let chunks = "";

                while (true) {
                    const {done, value} = await reader.read();
                    if (done) break;
                    chunks += decoder.decode(value, {stream: true});
                    setChatlog(chunks);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [matches]); // Re-fetch data when 'matches' changes

    return (
        <blockquote><div><b>Ask ChatGPT</b>
            <div><b>Question:</b> {matches[0]}</div>
            {loading && <div>Loading...</div>}
            <div><b>Answer:</b><br/>
                {chatlog}
            </div>
        </div></blockquote>
    );
}

export default ChatGPT;
