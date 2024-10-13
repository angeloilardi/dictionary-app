export async function getDefinition(formData: FormData) {
    const word = formData.get('word')
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,

    );
    const data = await res.json()
    console.log(data);
    return data
}