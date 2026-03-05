import React from "react";
import { Grid } from "@mui/material";
import CutsomCharts from "./CutsomCharts";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllRestaurant,
  MenuPerRestaurant,
  orderAndRevenuePerRestaurant,
  revenuePerRestaurant,
} from "../../store/slices/restaurantSlice";
import { useEffect } from "react";

const Dashboard = () => {
  const [openRestaurants, setOpenRestaurant] = useState(0);
  const [totalRestaurants, setTotalRestaurants] = useState(0);
  const [totalMenu, setTotalMenu] = useState(0);
  const [menudata, setMenudata] = useState(0);
  const [orderdata, setOrderdata] = useState();
  const [revenuedata, setRevenuedata] = useState();
  const [totalOrders, setTotalOrders] = useState(0);
  const [yAxisRestaurant, setYAxisRestaurant] = useState();
  const [revenuePerday, setRevenuePerday] = useState();
  const [dates, setDates] = useState();
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchRestro = async () => {
      const result = await dispatch(getAllRestaurant());
      const result2 = await dispatch(MenuPerRestaurant());
      const result3 = await dispatch(orderAndRevenuePerRestaurant());
      const result4 = await dispatch(revenuePerRestaurant());

      if (result3.payload?.success) {
        setOrderdata(result3.payload.data.orderArray);
        setRevenuedata(result3.payload.data.revenueArray);
        setYAxisRestaurant(result3.payload.data.restaurantArray);
        setTotalOrders(
          result3.payload.data.orderArray.reduce(
            (sum, restaurant) => sum + restaurant.y,
            0,
          ),
        );
      }

      if (result.payload?.success) {
        setTotalRestaurants(result.payload.data.length);
        let count = 0;
        result.payload.data.forEach((restauarnt) => {
          if (restauarnt.isOpen) count++;
        });
        setOpenRestaurant(count);

      }if (result4.payload?.success) {
        setRevenuePerday(result4.payload.data.revenueArray);
        setDates(result4.payload.data.dates);
      }

      if (result2.payload?.success) {
        setMenudata(result2.payload.data);
        setTotalMenu(
          result2.payload.data.reduce((sum, item) => {
            return sum + item.y;
          }, 0),
        );
      }
    };

    fetchRestro();
  }, []);

  console.log("revenuePerday" , revenuePerday);
  

  return (
    <Grid container size={12}>
      <Grid size={{ md: 6, sm: 12 }}>
        <CutsomCharts
          type="pie"
          name="total"
          title="Restaurants"
          subtitle="Total Restaurants"
          total={totalRestaurants}
          xData={yAxisRestaurant}
          data={[{ name:'total', data:[
            { name: "open", y: openRestaurants },
            { name: "close", y: totalRestaurants - openRestaurants },
          ]},]}
        />
      </Grid>
      <Grid size={{ md: 6, sm: 12 }}>
        <CutsomCharts
          title="Menu per Restaurant"
          subtitle="total Menu"
          name="menu"
          yName="number of menu"
          type="column"
          xData={yAxisRestaurant}
          total={totalMenu}
          data={[{ name:'menu', data:menudata},]}
        />
      </Grid>
      <Grid size={{ md: 6, sm: 12 }}>
        <CutsomCharts
          title="order per Restaurant"
          subtitle="total Order"
          name="orders"
          type="line"
          total={totalOrders}
          xData={yAxisRestaurant}
          yName="Number of orders"
          xName="restaurant"
          data={[{ name:'orders', data:orderdata},]}
        />  
      </Grid>
      <Grid size={{ md: 6, sm: 12 }}>
        <CutsomCharts
          title="revenue per Restaurant"
          name="orders"
          type="line"
          xData={yAxisRestaurant}
          yName="Revenue"
          xName="restaurant"
          data={[{ name:'revenue', data:revenuedata},]}
        />  
      </Grid>
      {revenuePerday && <Grid size={{ md: 6, sm: 12 }}>
        <CutsomCharts
          title="order per Restaurant"
          name="revenue"
          type="line"
          xData={dates}
          yName="Revenue"
          yData={totalRestaurants}
          xName="restaurant"
          data={revenuePerday}
        />
      </Grid>}
    </Grid>
  );
};

export default Dashboard;
