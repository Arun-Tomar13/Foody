import { notifyError, notifySuccess } from "../utils/feedback";

const successMessages = {
  "user/create/fulfilled": "Account created successfully.",
  "user/login/fulfilled": "Logged in successfully.",
  "user/logout/fulfilled": "Logged out successfully.",
  "user/updateProfile/fulfilled": "Profile updated successfully.",
  "restaurant/create/fulfilled": "Restaurant saved successfully.",
  "restaurant/deletebyid/fulfilled": "Restaurant removed successfully.",
  "restaurant/update/fulfilled": "Restaurant updated successfully.",
  "restaurant/toggle/fulfilled": "Restaurant availability updated.",
  "menu/create/fulfilled": "Menu item saved successfully.",
  "menu/bulk/fulfilled": "Menu uploaded successfully.",
  "menu/update/fulfilled": "Menu item updated successfully.",
  "menu/get-all/fulfilled": "Menu item removed successfully.",
  "category/create/fulfilled": "Category saved successfully.",
  "category/bulk-upload/fulfilled": "Categories uploaded successfully.",
  "category/delete/fulfilled": "Category removed successfully.",
  "category/update/fulfilled": "Category updated successfully.",
  "cart/create/fulfilled": "Cart updated successfully.",
  "cart/decrease/fulfilled": "Cart updated successfully.",
  "address/add/fulfilled": "Address saved successfully.",
  "address/removebyId/fulfilled": "Address removed successfully.",
  "transaction/add/fulfilled": "Wallet topped up successfully.",
  "order/create/fulfilled": "Order placed successfully.",
  "order/csv/fulfilled": "CSV generated successfully.",
};

const getSuccessMessage = (action, state) => {
  if (action.type === "restaurant/toggle/fulfilled") {
    return state.restaurant?.restaurant?.isOpen
      ? "Restaurant is now open."
      : "Restaurant is closed.";
  }

  return successMessages[action.type];
};

export const notificationMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  if (action.type?.endsWith("/rejected")) {
    notifyError(action.payload || action.error);
    return result;
  }

  if (action.type?.endsWith("/fulfilled") && action.payload?.success === false) {
    if (
      action.type === "cart/create/fulfilled" &&
      action.payload?.message === "item is from other restaurant"
    ) {
      return result;
    }

    notifyError(action.payload);
    return result;
  }

  if (action.payload?.success && successMessages[action.type]) {
    const successMessage = getSuccessMessage(action, store.getState());
    notifySuccess(
      action.type === "restaurant/toggle/fulfilled"
        ? successMessage
        : action.payload,
      successMessage,
    );
  }

  return result;
};
