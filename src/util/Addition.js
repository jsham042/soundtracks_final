class Addition {
  addNumbers(a, b) {
    if (typeof a !== "number" || typeof b !== "number") {
      throw new Error("Both inputs must be numeric");
    }
    return a + b;
  }
}

export default Addition;
