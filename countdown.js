// Countdown Timer Logic
        let countdownDate = new Date("oct 06, 2025 23:59:59").getTime();

        function updateCountdown() {
            const now = new Date().getTime();
            const distance = countdownDate - now;

            if (distance > 0) {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                // Update display with animation
                updateTimeUnit('days', days);
                updateTimeUnit('hours', hours);
                updateTimeUnit('minutes', minutes);
                updateTimeUnit('seconds', seconds);
            } else {
                // Deal expired
                document.getElementById('days').textContent = '00';
                document.getElementById('hours').textContent = '00';
                document.getElementById('minutes').textContent = '00';
                document.getElementById('seconds').textContent = '00';

                document.querySelector('.offer-notice').innerHTML =
                    '<span style="color: #dc3545; font-weight: bold;">DEAL EXPIRED!</span>';
            }
        }

        function updateTimeUnit(unitId, value) {
            const element = document.getElementById(unitId);
            const formattedValue = String(value).padStart(2, '0');

            if (element.textContent !== formattedValue) {
                element.classList.add('update');
                element.textContent = formattedValue;

                setTimeout(() => {
                    element.classList.remove('update');
                }, 300);
            }
        }

        function shopNow() {
            alert('Redirecting to product page...');
            // Here you would typically redirect to the actual product page
            // window.location.href = '/product/roland-grand-white-tshirt';
        }

        // Initialize countdown
        updateCountdown();

        // Update every second
        setInterval(updateCountdown, 1000);