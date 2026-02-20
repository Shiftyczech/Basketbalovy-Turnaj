const { Client } = require('pg');

exports.handler = async (event) => {
    // Povolíme pouze POST požadavky (odeslání formuláře)
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Metoda není povolena' };
    }

    try {
        // Převedeme příchozí data z textu na objekt
        const data = JSON.parse(event.body);
        const { Kapitan, Email, Tym, Zprava } = data;

        // Nastavení připojení k Neon databázi
        const client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false } // Důležité pro Neon
        });
        
        await client.connect();

        // SQL příkaz pro vložení dat
        const query = `
            INSERT INTO registrace (kapitan, email, tym, zprava)
            VALUES ($1, $2, $3, $4)
            RETURNING id;
        `;
        const values = [Kapitan, Email, Tym, Zprava];
        
        // Spuštění příkazu a ukončení připojení
        await client.query(query, values);
        await client.end();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Tým byl úspěšně zaregistrován!" })
        };

    } catch (error) {
        console.error("Chyba při zápisu do DB:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Jejda, něco se pokazilo při ukládání registrace." })
        };
    }
};