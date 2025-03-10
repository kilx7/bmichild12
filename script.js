let myChart = null;

const adviceList = {
    "نحافة": {
        parent: [
            "1. زيادة عدد الوجبات إلى 5-6 وجبات يومية",
            "2. إضافة زيت الزيتون إلى الأطعمة",
            "3. مراجعة أخصائي تغذية",
            `<a href="https://www.mayoclinic.org/ar/healthy-lifestyle/nutrition-and-healthy-eating/expert-answers/underweight/faq-20058429" target="_blank">مرجع طبي للنحافة</a>`
        ],
        teacher: [
            "1. مراقبة تغذية الطفل في المدرسة",
            "2. توفير وجبات خفيفة صحية",
            "3. التواصل مع الأهل",
            `<a href="https://www.mayoclinic.org/ar/healthy-lifestyle/nutrition-and-healthy-eating/expert-answers/underweight/faq-20058429" target="_blank">مرجع للمعلمين</a>`
        ]
    },
    "مثالي": {
        parent: ["🎉 حافظ على النظام الغذائي الصحي!"],
        teacher: ["🏆 شجع التلاميذ على الاستمرار!"]
    },
    "وزن زائد": {
        parent: [
            "1. تقليل العصائر المحلاة",
            "2. ممارسة الرياضة الجماعية",
            "3. استبدال المقليات بالمسلوق",
            `<a href="https://www.mayoclinic.org/ar/healthy-lifestyle/weight-loss/in-depth/weight-loss/art-20048466" target="_blank">مرجع طبي لزيادة الوزن</a>`
        ],
        teacher: [
            "1. تنظيم أنشطة رياضية إضافية",
            "2. توعية حول الوجبات المدرسية",
            "3. إشراك الأهل",
            `<a href="https://www.mayoclinic.org/ar/healthy-lifestyle/weight-loss/in-depth/weight-loss/art-20048466" target="_blank">مرجع للمعلمين</a>`
        ]
    },
    "سمنة مفرطة": {
        parent: [
            "1. مراجعة طبيب أطفال فورية",
            "2. تحديد وقت الشاشات إلى ساعة يوميًا",
            "3. مشاركة الأسرة في الأنشطة",
            `<a href="https://www.mayoclinic.org/ar/diseases-conditions/childhood-obesity/symptoms-causes/syc-20354827" target="_blank">مرجع طبي للسمنة</a>`
        ],
        teacher: [
            "1. تنظيم ورش عمل عن السمنة",
            "2. مراقبة المقاصف المدرسية",
            "3. التعاون مع المختصين",
            `<a href="https://www.mayoclinic.org/ar/diseases-conditions/childhood-obesity/symptoms-causes/syc-20354827" target="_blank">مرجع للمعلمين</a>`
        ]
    }
};

// ... (باقي الكود يبقى كما هو مع التأكد من مسارات الصور) ...

const bmiData = {
    female: {
        2: [14.3, 18.5, 25, 30],
        5: [13.8, 18.5, 25, 30],
        10: [14.2, 18.5, 25, 30],
        18: [18.5, 24.9, 29.9, 40]
    },
    male: {
        2: [14.8, 18.5, 25, 30],
        5: [14.4, 18.5, 25, 30],
        10: [15.1, 18.5, 25, 30],
        18: [18.5, 24.9, 29.9, 40]
    }
};

function getReferenceData(age, gender) {
    const ages = Object.keys(bmiData[gender]).sort((a, b) => a - b);
    const closestAge = ages.reduce((prev, curr) =>
        Math.abs(curr - age) < Math.abs(prev - age) ? curr : prev
    );
    return bmiData[gender][closestAge];
}

function validateName(input) {
    const regex = /^[\u0600-\u06FF\s]+$/;
    if (!regex.test(input.value)) {
        input.value = input.value.replace(/[^ء-ي\s]/g, '');
        document.getElementById('nameError').textContent = 'يسمح بالأحرف العربية فقط!';
    } else {
        document.getElementById('nameError').textContent = '';
    }
}

function validateNumber(input) {
    const regex = /^[0-9]*$/;
    if (!regex.test(input.value)) {
        input.value = input.value.replace(/[^0-9]/g, '');
        document.getElementById(`${input.id}Error`).textContent = 'يسمح بالأرقام فقط!';
    } else {
        document.getElementById(`${input.id}Error`).textContent = '';
    }
}

function calculateBMI() {
    const inputs = document.querySelectorAll('input');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            document.getElementById(`${input.id}Error`).textContent = 'هذا الحقل مطلوب!';
        } else {
            document.getElementById(`${input.id}Error`).textContent = '';
        }
    });

    if (!isValid) return;

    const age = parseInt(document.getElementById('age').value);
    if (age > 18 || age < 2) {
        alert("الرجاء إدخال عمر بين 2 و 18 سنة!");
        return;
    }

    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    
    if (weight <= 0 || height <= 0) {
        alert("الرجاء إدخال قيم صحيحة!");
        return;
    }

    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters ** 2)).toFixed(1);
    
    showResult(bmi);
    updateChart(bmi);
}

function getCategory(bmi, age, gender) {
    const refData = getReferenceData(age, gender);
    if (bmi < refData[0]) return 'نحافة';
    if (bmi < refData[1]) return 'مثالي';
    if (bmi < refData[2]) return 'وزن زائد';
    return 'سمنة مفرطة';
}

function showResult(bmi) {
    const userType = document.getElementById('userType').value;
    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const category = getCategory(parseFloat(bmi), age, gender);
    const resultDiv = document.getElementById('result');
    const adviceDiv = document.getElementById('advice');
    const bmiImage = document.getElementById('bmiImage');

    const images = {
        'نحافة': 'images/underweight.png',
        'مثالي': 'images/normal.png',
        'وزن زائد': 'images/overweight.png',
        'سمنة مفرطة': 'images/obese.png'
    };
    bmiImage.src = images[category];

    if (!adviceList[category]) {
        alert("خطأ في تحليل النتائج!");
        return;
    }

    resultDiv.classList.remove('hidden');
    resultDiv.classList.add('active');
    
    document.getElementById('bmiValue').textContent = bmi;
    document.getElementById('resultTitle').textContent = category;

    const adviceItems = adviceList[category][userType];
    adviceDiv.innerHTML = adviceItems.map(item => `
        <div class="advice-item">${item}</div>
    `).join('');

    if (category === 'مثالي') showCelebration();
}

function updateChart(bmi) {
    const ctx = document.getElementById('bmiChart').getContext('2d');
    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    
    if (myChart) myChart.destroy();
    
    const refData = getReferenceData(age, gender);
    const labels = ['نحافة', 'مثالي', 'وزن زائد', 'سمنة مفرطة'];
    
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'المعدلات المرجعية',
                data: refData,
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                tension: 0.3,
                borderWidth: 3,
                pointBackgroundColor: '#2563eb',
                pointHoverRadius: 8,
                fill: true
            }, {
                label: 'نتيجة الطفل',
                data: Array(refData.length).fill(bmi),
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderDash: [5, 5],
                borderWidth: 3,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: '#10b981'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'مقارنة النتيجة مع المعدلات العمرية',
                    font: { 
                        size: 18,
                        weight: 'bold',
                        family: 'Tajawal'
                    },
                    padding: { bottom: 15 }
                },
                legend: {
                    position: 'top',
                    align: 'start',
                    rtl: true,
                    labels: { 
                        font: { 
                            size: 14,
                            family: 'Tajawal'
                        },
                        usePointStyle: true
                    }
                },
                tooltip: {
                    rtl: true,
                    titleFont: { family: 'Tajawal' },
                    bodyFont: { family: 'Tajawal' },
                    callbacks: {
                        label: (context) => {
                            const label = context.dataset.label || '';
                            return `${label}: ${context.raw} BMI`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    title: { 
                        display: true, 
                        text: 'مؤشر كتلة الجسم (BMI)',
                        font: { size: 14, family: 'Tajawal' }
                    },
                    grid: { color: '#e2e8f0' }
                },
                x: {
                    ticks: { 
                        font: { 
                            size: 14, 
                            family: 'Tajawal' 
                        }
                    },
                    grid: { display: false }
                }
            },
            elements: {
                line: {
                    tension: 0.3
                }
            },
            rtl: true
        }
    });
}

function showCelebration() {
    const celebration = document.getElementById('celebration');
    celebration.style.display = 'block';
    setTimeout(() => {
        celebration.style.display = 'none';
    }, 3000);
}