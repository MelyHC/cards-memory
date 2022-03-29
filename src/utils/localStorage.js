export const getLocalStorage = (item) => {
  try {
    const data = localStorage.getItem(item);
    const jsonData = JSON.parse(data);
    return jsonData;

  } catch (ex) {

    console.log('Excepción', ex);
    return null;
  }
};