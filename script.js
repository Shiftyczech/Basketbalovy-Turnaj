document.getElementById('teamForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Zabrání přesměrování stránky
    
    const form = e.target;
    const statusText = document.getElementById('form-status');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Změníme text tlačítka, aby uživatel viděl, že se něco děje
    submitBtn.textContent = 'Odesílám...';
    submitBtn.disabled = true;
    statusText.textContent = ''; // Vymaže předchozí zprávy

    // Sesbíráme data z formuláře
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        // Odeslání dat na naši Netlify funkci
        const response = await fetch('/.netlify/functions/submit-team', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            // Úspěch!
            statusText.style.color = '#28a745'; // Zelená barva
            statusText.textContent = 'Paráda! Tým byl úspěšně zaregistrován.';
            form.reset(); // Promaže políčka formuláře
        } else {
            // Chyba ze serveru
            statusText.style.color = '#dc3545'; // Červená barva
            statusText.textContent = 'Chyba: ' + result.error;
        }
    } catch (error) {
        // Chyba připojení (např. vypadlý internet)
        statusText.style.color = '#dc3545';
        statusText.textContent = 'Došlo k chybě při komunikaci se serverem.';
    } finally {
        // Vrátíme tlačítko do původního stavu
        submitBtn.textContent = 'Odeslat přihlášku';
        submitBtn.disabled = false;
    }
});