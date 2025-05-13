let cars = JSON.parse(localStorage.getItem('cars')) || [];

const maintenanceTypes = [
    "Vidange huile moteur",
    "Changement filtres",
    "Changement pneus",
    "Freins",
    "Batterie",
    "Autres"
];

function saveCars() {
    localStorage.setItem('cars', JSON.stringify(cars));
}

function deleteCar(carId) {
    if (confirm('Voulez-vous vraiment supprimer cette voiture ?')) {
        cars = cars.filter(car => car.id !== carId);
        saveCars();
        renderCars();
    }
}

function showMaintenanceForm(carId) {
    const typeOptions = maintenanceTypes.map(type => `<option value="${type}">${type}</option>`).join('');
    const formHtml = `
        <div class="maintenance-form">
            <select id="maintType-${carId}" required>${typeOptions}</select>
            <input type="date" id="maintDate-${carId}" required>
            <input type="number" id="maintKm-${carId}" placeholder="Kilométrage" required>
            <input type="number" id="maintCost-${carId}" placeholder="Coût (DT)" required>
            <input type="text" id="maintDetails-${carId}" placeholder="Détails">
            <button onclick="addMaintenance(${carId})">Enregistrer</button>
        </div>
    `;
    document.getElementById(`maintForm-${carId}`).innerHTML = formHtml;
}

function addMaintenance(carId) {
    const type = document.getElementById(`maintType-${carId}`).value;
    const date = document.getElementById(`maintDate-${carId}`).value;
    const km = document.getElementById(`maintKm-${carId}`).value;
    const cost = document.getElementById(`maintCost-${carId}`).value;
    const details = document.getElementById(`maintDetails-${carId}`).value;

    if (!type || !date || !km || !cost) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }

    const car = cars.find(car => car.id === carId);
    if (car) {
        car.maintenance.push({
            id: Date.now(),
            type,
            date,
            km: parseInt(km),
            cost: parseFloat(cost),
            details
        });
        saveCars();
        renderCars();
    }
}

function deleteMaintenance(carId, maintenanceId) {
    if (confirm('Voulez-vous vraiment supprimer cet entretien ?')) {
        const car = cars.find(car => car.id === carId);
        if (car) {
            car.maintenance = car.maintenance.filter(m => m.id !== maintenanceId);
            saveCars();
            renderCars();
        }
    }
}

function addCar() {
    const brand = document.getElementById('brand').value;
    const model = document.getElementById('model').value;
    const year = document.getElementById('year').value;
    const immatriculation = document.getElementById('immatriculation').value;
    const kilometrage = document.getElementById('kilometrage').value;
    const carburant = document.getElementById('carburant').value;
    const transmission = document.getElementById('transmission').value;
    const puissance = document.getElementById('puissance').value;

    if (!brand || !model || !year || !immatriculation || !kilometrage) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
    }

    const car = {
        id: Date.now(),
        brand,
        model,
        year,
        immatriculation,
        kilometrage: parseInt(kilometrage),
        carburant,
        transmission,
        puissance: puissance ? parseInt(puissance) : null,
        maintenance: []
    };

    cars.push(car);
    saveCars();
    renderCars();
    clearForm();
}

function clearForm() {
    const inputs = document.querySelectorAll('.car-form input, .car-form select');
    inputs.forEach(input => input.value = '');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
}

function calculateTotalCost(maintenance) {
    return maintenance.reduce((total, m) => total + parseFloat(m.cost), 0).toFixed(2);
}

function renderCars() {
    const carsDiv = document.getElementById('cars');
    carsDiv.innerHTML = '';

    cars.forEach(car => {
        const carDiv = document.createElement('div');
        carDiv.className = 'car';
        carDiv.innerHTML = `
            <div class="car-header">
                <h2>${car.brand} ${car.model} (${car.year})</h2>
                <div class="car-actions">
                    <button onclick="showMaintenanceForm(${car.id})">➕ Ajouter entretien</button>
                    <button onclick="deleteCar(${car.id})" class="delete-btn">🗑️ Supprimer</button>
                </div>
            </div>
            <div class="car-details">
                <p><strong>Immatriculation:</strong> ${car.immatriculation}</p>
                <p><strong>Kilométrage:</strong> ${car.kilometrage} km</p>
                <p><strong>Carburant:</strong> ${car.carburant || 'Non spécifié'}</p>
                <p><strong>Transmission:</strong> ${car.transmission || 'Non spécifié'}</p>
                <p><strong>Puissance:</strong> ${car.puissance ? car.puissance + ' CV' : 'Non spécifié'}</p>
            </div>
            <div class="maintenance-summary">
                <h3>Résumé des entretiens</h3>
                <p>Nombre d'entretiens: ${car.maintenance.length}</p>
                <p>Dernier entretien: ${car.maintenance.length > 0 ? formatDate(car.maintenance[car.maintenance.length-1].date) : 'Aucun'}</p>
                <p>Coût total: ${calculateTotalCost(car.maintenance)} DT</p>
            </div>
            <div id="maintForm-${car.id}" class="maintenance-form"></div>
            <div class="maintenance">
                ${car.maintenance.map(m => `
                    <p>
                        <span>🔧 ${m.type} le ${formatDate(m.date)} à ${m.km} km (<strong>${m.cost} DT</strong>)
                        ${m.details ? `<br><small>${m.details}</small>` : ''}</span>
                        <button onclick="deleteMaintenance(${car.id}, ${m.id})" class="delete-btn">❌</button>
                    </p>
                `).join('')}
            </div>
        `;
        carsDiv.appendChild(carDiv);
    });
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    
    document.getElementById(sectionId).classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    
    document.querySelector('.dashboard').classList.remove('hidden');
    
    renderCars();
});
    showSection('car-list');


