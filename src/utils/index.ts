export const timeout = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

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

export const get_month = (month: number) => {
  switch (month) {
    case 1:
      return "Janvier";
    case 2:
      return "Février";
    case 3:
      return "Mars";
    case 4:
      return "Avril";
    case 5:
      return "Mai";
    case 6:
      return "Juin";
    case 7:
      return "Juillet";
    case 8:
      return "Août";
    case 9:
      return "Septembre";
    case 10:
      return "Octobre";
    case 11:
      return "Novembre";
    case 12:
      return "Décembre";
    default:
      return "Mois";
  }
};

export const geenrate_random_string = (length: number) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
