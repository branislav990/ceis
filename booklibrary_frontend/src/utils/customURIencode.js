const customURIencode = (str) => {
    return str
        .replaceAll(" ", "-")
        .replace("ž", "z")
        .replace("ć", "c")
        .replace("č", "c")
        .replace("đ", "dj")
        .replace("š", "s")
        .replace("/", "-")
        .toLowerCase();
};

export default customURIencode;
