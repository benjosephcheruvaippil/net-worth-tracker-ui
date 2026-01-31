import React, { useEffect, useState } from "react";
import AssetForm from "../components/AssetForm";
//import axios from "axios";
import { Bars } from "react-loader-spinner";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Modal/Popup component
const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    ×
                </button>
                {children}
            </div>
        </div>
    );
};

const AssetDetails = () => {

    const columns = [
        { field: 'id', headerName: 'AssetId', width: 100 },
        { field: 'investmentEntity', headerName: 'InvestmentEntity', width: 100 },
        { field: 'investmentType', headerName: 'Type', width: 100 },
        { field: 'amount', headerName: 'Amount', width: 100 },
        { field: 'interestRate', headerName: 'InterestRate', width: 100 },
        { field: 'interestFrequency', headerName: 'InterestFrequency', width: 100 },
        { field: 'userId', headerName: 'UserId', width: 100 },
        { field: 'startDate', headerName: 'StartDate', width: 100 },
        { field: 'maturityDate', headerName: 'MaturityDate', width: 100 },
        { field: 'asOfDate', headerName: 'AsOfDate', width: 100 },
        { field: 'remarks', headerName: 'Remarks', width: 100 },
    ];

    const [data, setData] = useState([]);
    const [page, setPageSize] = useState([25]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate(); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Bearer Token: ", localStorage.getItem("loginToken"));
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://networthtrackerapi20240213185304.azurewebsites.net/api/General/getAssetDetails', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("loginToken")}`
                }
            });
            if (response.ok) {
                const result = await response.json();
                setData(result);
            }
            else if(response.status===401){
                navigate('/login'); 
            }
        }
        catch (error) {
            console.log("Error fetching data: ", error);
        }
        finally{
            setLoading(false);
        }
    };

    const handleOpenModal = () => {
        console.log("Opening popup modal...");
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        console.log("Closing popup modal...");
        setIsModalOpen(false);
    };

    const handleFormSuccess = () => {
        // Close modal and refresh data after successful form submission
        console.log("Form submitted successfully!");
        setIsModalOpen(false);
        fetchData(); // Refresh the data grid
    };

    return (
        <div>
            <Box sx={{ height: 400, width: '100%' }}>
                {/* Header with Title and Add Button */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <h1>Asset Report</h1>
                    <Button 
                        variant="contained" 
                        color="primary"
                        onClick={handleOpenModal}
                        sx={{ height: 'fit-content' }}
                    >
                        Add New Asset
                    </Button>
                </Box>

                {loading ? (
                    <Bars height="50" width="50" color="#4fa94d" ariaLabel="loading" />
                ) : (
                    <Box sx={{ height: 500, maxWidth: '100%', overflowX: 'auto' }}>
                        <DataGrid
                            rows={data}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            pagination
                            sx={{
                                minWidth: '600px',
                                '& .MuiDataGrid-columnHeaders': {
                                    backgroundColor: '#f5f5f5',
                                },
                            }}
                        />
                    </Box>
                )}
            </Box>

            {/* Popup Modal with AssetForm */}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>
                    Add New Asset
                </h2>
                <AssetForm 
                    onSuccess={handleFormSuccess} 
                    onCancel={handleCloseModal} 
                />
            </Modal>

            {/* Popup/Modal Styles */}
            <style>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    animation: fadeIn 0.2s ease-in;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                .modal-content {
                    background: white;
                    padding: 30px;
                    border-radius: 8px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                    max-width: 600px;
                    width: 90%;
                    max-height: 90vh;
                    overflow-y: auto;
                    position: relative;
                    animation: slideDown 0.3s ease-out;
                }

                @keyframes slideDown {
                    from {
                        transform: translateY(-50px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                .modal-close {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: none;
                    border: none;
                    font-size: 32px;
                    cursor: pointer;
                    color: #666;
                    line-height: 1;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    z-index: 1;
                    transition: color 0.2s;
                }

                .modal-close:hover {
                    color: #000;
                }

                .modal-content h2 {
                    margin-top: 0;
                    margin-bottom: 20px;
                    color: #333;
                }
            `}</style>
        </div>
    );
}

export default AssetDetails;