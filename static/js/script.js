function app() {
    return {
        darkMode: localStorage.getItem('darkMode') === 'true',
        toggleDarkMode() {
            this.darkMode = !this.darkMode;
            localStorage.setItem('darkMode', this.darkMode);
        }
    };
}


function calculatorForm() {
    return {
        formData: {
            petrol_price: null,
            mileage_min: null,
            mileage_max: null,
            distances: '',
            base_kms: null,
            extra_rate: null
        },
        results: null,
        loading: false,
        
        async submitForm() {
            // Reset previous results
            this.results = null;
            this.loading = true;
            
            try {
                // Prepare form data
                const formData = new FormData();
                Object.entries(this.formData).forEach(([key, value]) => {
                    // Convert distances to string if it's an array
                    const processedValue = key === 'distances' 
                        ? (Array.isArray(value) ? value.join(',') : value)
                        : value;
                    formData.append(key, processedValue);
                });

                // Send request
                const response = await fetch('/calculate', {
                    method: 'POST',
                    body: formData
                });

                // Parse response
                const data = await response.json();
                
                // Handle errors
                if (data.error) {
                    throw new Error(data.error);
                }

                // Set results
                this.results = data;
            } catch (error) {
                // Show error message
                alert(`Calculation Error: ${error.message}`);
                console.error(error);
            } finally {
                // Always stop loading
                this.loading = false;
            }
        }
    };
}

// Initialize Alpine
document.addEventListener('alpine:init', () => {
    Alpine.data('calculatorForm', calculatorForm);
});