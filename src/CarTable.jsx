import React, { useState, useEffect } from 'react';

const CarTable = () => {
  const [cars, setCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [carsPerPage] = useState(10); // Change this value to set the number of cars per page
  const [editCarData, setEditCarData] = useState({});
  const [deleteCarData, setDeleteCarData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCarData, setNewCarData] = useState({});

  // Load initial data from API
  useEffect(() => {
    const storedCars = localStorage.getItem('cars');
    if (storedCars) {
      // If there is existing data in the local storage, parse and set it in the state
      setCars(JSON.parse(storedCars));
    } else {
      // If no existing data, fetch from API
      fetch('https://myfakeapi.com/api/cars')
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            console.log('API Response:', data);
            setCars(data.cars);
            localStorage.setItem('cars', JSON.stringify(data.cars));
          } else {
            console.log('Invalid API Response:', data);
            setCars(data.cars);
            localStorage.setItem('cars', JSON.stringify(data.cars));
          }
        })
        .catch((error) => console.log(error));
    }
  }, []);

  // Filter cars based on the search term
  const filteredCars = cars.filter(
    (car) =>
      car &&
      Object.values(car).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
  );


  // Pagination Logic
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Open Edit Modal
  const openEditModal = (car) => {
    setEditCarData(car);
    setIsEditModalOpen(true);
  };

  // Update Edit Modal Form
  const updateEditModalForm = (field, value) => {
    setEditCarData((prevData) => ({ ...prevData, [field]: value }));
  };

  const saveEditModalForm = (event) => {
    event.preventDefault();
    const editedCarIndex = cars.findIndex((car) => car.car_vin === editCarData.car_vin);
    const updatedCars = [...cars];
    updatedCars[editedCarIndex] = {
      ...updatedCars[editedCarIndex],
      car_color: editCarData.car_color,
      price: editCarData.price,
      availability: editCarData.availability,
    };
    setCars(updatedCars);
    setIsEditModalOpen(false);
    localStorage.setItem('cars', JSON.stringify(updatedCars)); // Update local storage
  };

  // Open Delete Modal
  const openDeleteModal = (car) => {
    setDeleteCarData(car);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete
  const confirmDelete = () => {
    const deleteCarIndex = cars.findIndex((car) => car.car_vin === deleteCarData.car_vin);
    const updatedCars = [...cars];
    updatedCars.splice(deleteCarIndex, 1);
    setCars(updatedCars);
    setIsDeleteModalOpen(false);
    localStorage.setItem('cars', JSON.stringify(updatedCars)); // Update local storage
  };

  // Open Add Modal
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  // Update Add Modal Form
  const updateAddModalForm = (field, value) => {
    setNewCarData((prevData) => ({ ...prevData, [field]: value }));
  };

  // Save Add Modal Form
  const saveAddModalForm = () => {
    const updatedCars = [newCarData, ...cars];
    setCars(updatedCars);
    setIsAddModalOpen(false);
    localStorage.setItem('cars', JSON.stringify(updatedCars)); // Update local storage
  };

  const pageNumber = [];
  for (let i = 1; i <= Math.ceil(filteredCars.length / carsPerPage); i++) {
    pageNumber.push(i);
  }

  return (
    <div className='whole'>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Model</th>
            <th>VIN</th>
            <th>Color</th>
            <th>Year</th>
            <th>Price</th>
            <th>Availability</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentCars.map((car) => (
            <tr key={car.VIN}>
              <td>{car.car}</td>
              <td>{car.car_model}</td>
              <td>{car.car_vin}</td>
              <td>{car.car_color}</td>
              <td>{car.car_model_year}</td>
              <td>{car.price}</td>
              <td>{car.availability.toString(car.availability)}</td>
              <td>
                <select
                  onChange={(e) => {
                    const action = e.target.value;
                    if (action === 'edit') {
                      openEditModal(car);
                      setIsDeleteModalOpen(false)
                      setIsAddModalOpen(false)
                    } else if (action === 'delete') {
                      openDeleteModal(car);
                      setIsEditModalOpen(false)
                      setIsAddModalOpen(false)
                    } else if (action === "default") {
                      setIsEditModalOpen(false)
                      setIsDeleteModalOpen(false)
                      setIsAddModalOpen(false)
                    }

                  }}
                >
                  <option value="default"></option>
                  <option value="edit">Edit</option>
                  <option value="delete">Delete</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {/* Pagination */}
        <ul>
         <div className='buttons'>
  {pageNumber.map((number) => (
    <button key={number} onClick={() => paginate(number)}>
      {number}
    </button>
  ))}
</div>
        </ul>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div>
          <h2>Edit Car</h2>
          <form onSubmit={saveEditModalForm}>
            <div>
              <label>Company:</label>
              <input type="text" value={editCarData.car} disabled />
            </div>
            <div>
              <label>Model:</label>
              <input type="text" value={editCarData.car_model} disabled />
            </div>
            <div>
              <label>VIN:</label>
              <input type="text" value={editCarData.car_vin} disabled />
            </div>
            <div>
              <label>Color:</label>
              <input
                type="text"
                defaultValue={editCarData.car_color}
                onChange={(e) => updateEditModalForm('car_color', e.target.value)}
              />
            </div>
            <div>
              <label>Year:</label>
              <input type="text" value={editCarData.car_model_year} disabled />
            </div>
            <div>
              <label>Price:</label>
              <input
                type="text"
                defaultValue={editCarData.price}
                onChange={(e) => updateEditModalForm('price', e.target.value)}
              />
            </div>
            <div>
              <label>Availability:</label>
              <input
                type="text"
                defaultValue={editCarData.availability}
                onChange={(e) => updateEditModalForm('availability', e.target.value)}
              />
            </div>
            <button type="submit">Save</button>
            <button onClick={() => setIsEditModalOpen(false)}>Cancel</button>
          </form>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div>
          <h2>Delete Car</h2>
          <p>Are you sure you want to delete this car?</p>
          <button onClick={confirmDelete}>Yes</button>
          <button onClick={() => setIsDeleteModalOpen(false)}>No</button>
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div>
          <h2>Add Car</h2>
          <form onSubmit={saveAddModalForm}>
            <div>
              <label>Company:</label>
              <input
                type="text"
                value={newCarData.car}
                onChange={(e) => updateAddModalForm('car', e.target.value)}
              />
            </div>
            <div>
              <label>Model:</label>
              <input
                type="text"
                value={newCarData.car_model}
                onChange={(e) => updateAddModalForm('car_model', e.target.value)}
              />
            </div>
            <div>
              <label>VIN:</label>
              <input
                type="text"
                value={newCarData.car_vin}
                onChange={(e) => updateAddModalForm('car_vin', e.target.value)}
              />
            </div>
            <div>
              <label>Color:</label>
              <input
                type="text"
                value={newCarData.car_color}
                onChange={(e) => updateAddModalForm('car_color', e.target.value)}
              />
            </div>
            <div>
              <label>Year:</label>
              <input
                type="text"
                value={newCarData.car_model_year}
                onChange={(e) => updateAddModalForm('car_model_year', e.target.value)}
              />
            </div>
            <div>
              <label>Price:</label>
              <input
                type="text"
                value={newCarData.price}
                onChange={(e) => updateAddModalForm('price', e.target.value)}
              />
            </div>
            <div>
              <label>Availability:</label>
              <input
                type="text"
                value={newCarData.availability}
                onChange={(e) => updateAddModalForm('availability', e.target.value)}
              />
            </div>
            <button type="submit">Save</button>
            <button onClick={() => setIsAddModalOpen(false)}>Cancel</button>
          </form>
        </div>
      )}

      {/* Add Car Button */}
      <button className='add' onClick={openAddModal} disabled={isAddModalOpen ?? false}>Add Car</button>
    </div>
  );
};

export default CarTable;