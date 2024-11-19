document.addEventListener("DOMContentLoaded", function() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const loading = document.getElementById('loading');
            const resultContainer = document.getElementById('resultContainer');
            const result = document.getElementById('result');
            
            loading.style.display = 'block';
            resultContainer.style.display = 'none';
            
            fetch(form.action, {
                method: form.method,
                body: new FormData(form)
            })
            .then(response => response.json())
            .then(data => {
                loading.style.display = 'none';
                resultContainer.style.display = 'block';
                result.textContent = JSON.stringify(data, null, 2);
            })
            .catch(error => {
                loading.style.display = 'none';
                resultContainer.style.display = 'block';
                result.textContent = 'An error occurred: ' + error.message;
            });
            
            return false;
        });
    });
});
