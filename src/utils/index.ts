export const sanitize = (str: string) => {
  return str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, "").trim();
};

export const generate_new_id = (current_entry_id: string) => {
  const months = "ABCDEFGHIJKL";
  const lastEntryYear = current_entry_id.substring(0, 2);
  const thisYear = new Date().getFullYear();
  if (Number(lastEntryYear) === thisYear - Math.floor(thisYear / 100) * 100) {
    const lastEntryMonth = current_entry_id.substring(3, 4);
    const thisMonth = new Date().getMonth();
    if (lastEntryMonth === months[thisMonth]) {
      const lastId = parseInt(current_entry_id.substring(4)) + 1;
      if (lastId > 99) return current_entry_id.substring(0, 4) + String(lastId);
      if (lastId > 9 && lastId < 100)
        return current_entry_id.substring(0, 4) + "0" + String(lastId);
      if (lastId < 10)
        return current_entry_id.substring(0, 4) + "00" + String(lastId);
    } else {
      return current_entry_id.substring(0, 3) + months[thisMonth] + "001";
    }
  } else {
    return (
      String(thisYear - Math.floor(thisYear / 100) * 100) +
      current_entry_id.substring(2, 3) +
      "A001"
    );
  }
};
