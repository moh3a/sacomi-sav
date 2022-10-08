const reorder_file_paths = (array: string[]) => {
  let returnarray: string[] = [];
  let fileorder = [
    "clients",
    "entrees",
    "tableau",
    "prestations",
    "prestationdetails",
    "bls",
    "bcs",
  ];
  fileorder.forEach((n) => {
    const index = array.findIndex((e) => e.includes(n));
    if (index !== -1) returnarray.push(array[index]);
  });
  return returnarray;
};

export default reorder_file_paths;
