import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import AssetForm from "../components/AssetForm";
import axios from "axios";
import { Bars } from "react-loader-spinner";

export default function AssetDetails() {
    const columns = [
        {
            name: "Select",
            cell: (row) => (
                <button className="btn btn-danger" onClick={() => handleSelect(row.assetDetailId)}>Select</button>
            ),
            width: '90px'
        },
        {
            name: "Delete",
            cell: (row) => (
                <button className="btn btn-danger" onClick={() => handleDelete(row.assetDetailId)}>Delete</button>
            ),
            width: '90px'
        },
        // {
        //     name: "Asset Id",
        //     selector: (row) => row.assetDetailId,
        //     width: '80px',
        //     omit:true,
        // },
        {
            name: "Investment Entity",
            selector: (row) => row.investmentEntity,
        },
        {
            name: "Type",
            selector: (row) => row.investmentType.name,
        },
        {
            name: "Amount",
            selector: (row) => row.amount,
        },
        {
            name: "Interest Rate",
            selector: (row) => row.interestRate,
        },
        {
            name: "Start Date",
            selector: (row) => row.startDate==null?"":row.startDate.toString().split("T")[0],
        },
        {
            name: "Maturity Date",
            selector: (row) => row.maturityDate==null?"":row.maturityDate.toString().split("T")[0],
        },
        {
            name: "As Of Date",
            selector: (row) => row.asOfDate==null?"":row.asOfDate.toString().split("T")[0],
        }

    ];

    // const conditionalRowStyles = [
    //     {
    //         when: (row) => row.assetDetailId,
    //         style: {
    //             display: 'none',
    //         },
    //     },
    // ];

    //const [data, setData] = useState([]);
    const [search, SetSearch] = useState('');
    const [filter, setFilter] = useState([]);
    const [asset, setAssetData] = useState({});
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        const onLoad = async () => {
            console.log("asset details from useEffect");
            await getProduct();
        };
        onLoad();
    }, []);

    const getProduct = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get("http://localhost:5226/api/General/GetAssetDetails");
            setFilter(response.data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    const handleSelect = async (assetId) => {
        console.log(assetId);
        const selectedAsset = await fetchAsset(assetId);
        setAssetData(selectedAsset);
    }
    //handleDelete(row.assetDetailId)
    const handleDelete = async (assetId) => {
        console.log(assetId);
        await deleteAsset(assetId);
        //setRefreshAssets(true);
        console.log("asset details from handleDelete");
        await getProduct();
    }

    const handleButtonClick = async () => {
        // Do something when the button is clicked
        console.log("asset details from handleButtonClick");
        await getProduct();
        console.log('Button clicked in form component');
    };

    const fetchAsset = async (assetId) => {
        try {
            setIsLoading(true);
            const response = await axios.get("http://localhost:5226/api/General/GetAssetDetailById", {
                params: {
                    assetDetailId: assetId
                }
            });
            setIsLoading(false);
            //setAssetData(response.data);
            return response.data;
        }
        catch (error) {
            console.error("error:", error);
        }
    };

    const deleteAsset = async (assetId) => {
        try {
            const response = await axios.get("http://localhost:5226/api/General/DeleteAssetById", {
                params: {
                    assetDetailId: assetId
                }
            });
            if (response.data > 0) {
                alert("Asset deleted successfully");
            }
        }
        catch (error) {
            console.error("Error: ", error);
        }
    };

    const tableHeaderstyle = {
        headCells: {
            style: {
                fontWeight: "bold",
                fontSize: "14px",
                backgroundColor: "#ccc"

            },
        },
    }

    return (
        <React.Fragment>
            <h1>Asset List</h1>

            {isLoading ? (<div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Bars
                    height="80"
                    width="80"
                    color="#4fa94d"
                /></div>) : ""}

            <AssetForm onButtonClick={handleButtonClick} passedData={asset}></AssetForm>
            <DataTable
                customStyles={tableHeaderstyle}
                columns={columns}
                data={filter}
                //conditionalRowStyles={conditionalRowStyles}
                pagination
                // selectableRows
                fixedHeader
                selectableRowsHighlight
                highlightOnHover
                actions={
                    <button className="btn btn-success">Export Pdf</button>
                }
                subHeader
                subHeaderComponent={
                    <input type="text"
                        className="w-25 form-control"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => SetSearch(e.target.value)}

                    />
                }
                subHeaderAlign="right"

            />
        </React.Fragment>
    );
}