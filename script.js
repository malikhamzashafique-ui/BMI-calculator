let bmiChart = null;

function createBMIChart() {
    const canvas = document.getElementById('bmiChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart if it exists
    if (bmiChart) {
        bmiChart.destroy();
    }
    
    bmiChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Underweight', 'Normal', 'Overweight', 'Obese'],
            datasets: [
                {
                    label: 'BMI Range',
                    data: [18.5, 6.5, 5, 15],
                    backgroundColor: ['#4285f4', '#34a853', '#fbbc04', '#ea4335'],
                    borderRadius: 6,
                    borderSkipped: false,
                    maxBarThickness: 40,
                }
            ]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (context.dataIndex === 0) return 'BMI < 18.5';
                            if (context.dataIndex === 1) return 'BMI 18.5 - 24.9';
                            if (context.dataIndex === 2) return 'BMI 25 - 29.9';
                            if (context.dataIndex === 3) return 'BMI ≥ 30';
                        }
                    },
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 10,
                    cornerRadius: 4,
                    titleFont: { size: 12, weight: 'bold' },
                    bodyFont: { size: 11 }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 40,
                    ticks: {
                        callback: function(value) {
                            return value;
                        },
                        font: {
                            size: 11,
                            weight: '500'
                        },
                        color: '#5f6368'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        font: {
                            size: 12,
                            weight: '600'
                        },
                        color: '#202124',
                        padding: 12
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                }
            }
        }
    });
}

function updateBMIChart(bmi) {
    if (!bmiChart) return;
    
    // Highlight the category based on BMI
    const colors = ['#4285f4', '#34a853', '#fbbc04', '#ea4335'];
    const newColors = [];
    
    if (bmi < 18.5) {
        newColors.push('rgba(66, 133, 244, 1)');
        newColors.push('rgba(52, 168, 83, 0.3)');
        newColors.push('rgba(251, 188, 4, 0.3)');
        newColors.push('rgba(234, 67, 53, 0.3)');
    } else if (bmi < 25) {
        newColors.push('rgba(66, 133, 244, 0.3)');
        newColors.push('rgba(52, 168, 83, 1)');
        newColors.push('rgba(251, 188, 4, 0.3)');
        newColors.push('rgba(234, 67, 53, 0.3)');
    } else if (bmi < 30) {
        newColors.push('rgba(66, 133, 244, 0.3)');
        newColors.push('rgba(52, 168, 83, 0.3)');
        newColors.push('rgba(251, 188, 4, 1)');
        newColors.push('rgba(234, 67, 53, 0.3)');
    } else {
        newColors.push('rgba(66, 133, 244, 0.3)');
        newColors.push('rgba(52, 168, 83, 0.3)');
        newColors.push('rgba(251, 188, 4, 0.3)');
        newColors.push('rgba(234, 67, 53, 1)');
    }
    
    bmiChart.data.datasets[0].backgroundColor = newColors;
    bmiChart.update();
}

function calculateBMI() {
    // Get input values
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const heightUnit = document.getElementById('height-unit').value;
    const weightUnit = document.getElementById('weight-unit').value;

    // Validate inputs
    if (!height || !weight || height <= 0 || weight <= 0) {
        alert('Please enter valid height and weight values');
        return;
    }

    // Convert to metric units (meters and kilograms)
    let heightInMeters = height;
    let weightInKg = weight;

    // Convert height to meters
    switch(heightUnit) {
        case 'cm':
            heightInMeters = height / 100;
            break;
        case 'ft':
            heightInMeters = height * 0.3048;
            break;
        case 'm':
            heightInMeters = height;
            break;
    }

    // Convert weight to kg
    if (weightUnit === 'lbs') {
        weightInKg = weight * 0.453592;
    }

    // Calculate BMI
    const bmi = weightInKg / (heightInMeters * heightInMeters);
    const bmiRounded = bmi.toFixed(1);

    // Determine category and description
    let category = '';
    let categoryClass = '';
    let description = '';
    let scalePosition = 0;

    if (bmi < 18.5) {
        category = 'Underweight';
        categoryClass = 'category-underweight';
        description = 'You are below the healthy weight range. Consider consulting with a healthcare provider about a healthy weight gain plan.';
        scalePosition = (bmi / 18.5) * 25; // 0-25% of scale
    } else if (bmi >= 18.5 && bmi < 25) {
        category = 'Normal Weight';
        categoryClass = 'category-normal';
        description = 'Congratulations! You are within the healthy weight range. Maintain your current lifestyle with regular exercise and balanced nutrition.';
        scalePosition = 25 + ((bmi - 18.5) / (25 - 18.5)) * 25; // 25-50% of scale
    } else if (bmi >= 25 && bmi < 30) {
        category = 'Overweight';
        categoryClass = 'category-overweight';
        description = 'You are above the healthy weight range. Consider adopting a healthier diet and increasing physical activity.';
        scalePosition = 50 + ((bmi - 25) / (30 - 25)) * 25; // 50-75% of scale
    } else {
        category = 'Obese';
        categoryClass = 'category-obese';
        description = 'You are significantly above the healthy weight range. It\'s recommended to consult with a healthcare provider for a personalized weight management plan.';
        scalePosition = 75 + Math.min(((bmi - 30) / 10) * 25, 25); // 75-100% of scale
    }

    // Update the UI
    document.getElementById('bmi-value').textContent = bmiRounded;
    
    const categoryBadge = document.getElementById('bmi-category');
    categoryBadge.innerHTML = `<span class="category-badge ${categoryClass}">${category}</span>`;
    
    document.getElementById('bmi-description').textContent = description;
    
    // Update scale indicator position
    const scaleIndicator = document.getElementById('scale-indicator');
    scaleIndicator.style.left = `${Math.min(Math.max(scalePosition, 0), 100)}%`;

    // Update the chart
    updateBMIChart(bmi);

    // Add animation to result section
    const resultSection = document.getElementById('result-section');
    resultSection.style.animation = 'none';
    setTimeout(() => {
        resultSection.style.animation = 'fadeIn 0.5s ease-in';
    }, 10);
}

// Allow Enter key to trigger calculation
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the chart
    createBMIChart();
    
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                calculateBMI();
            }
        });
    });
});

// Add input validation for positive numbers only
document.getElementById('height').addEventListener('input', function(e) {
    if (this.value < 0) this.value = 0;
});

document.getElementById('weight').addEventListener('input', function(e) {
    if (this.value < 0) this.value = 0;
});
