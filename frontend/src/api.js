const sendMessage = async (query) => {
    try {
        const response = await fetch('http://localhost:3000/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query })
        });

        console.log(response);
    
        if(!response.ok) {
            throw new Error('Failed to fetch rsponse from server');
        };

        const data = await response.json();
        return {
            content: data.content,
            actor: "AI",
        };
        
    }catch(error){
        console.error('Error:', error);
        return {
            content: "Error: " + error.message,
            actor: "AI",
        };
    }

}



export default sendMessage;
