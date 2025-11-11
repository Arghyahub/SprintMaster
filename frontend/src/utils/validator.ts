import Util from "./util";

type numericInputParam = {
  value: string | number;
  decimal?: number;
  required?: boolean;
  min?: number;
  max?: number;
};

interface numericInputReturn {
  breakInput: boolean;
  isValid: boolean;
  error: string;
}

interface numericInputGeneratorType {
  decimal?: number;
  required?: boolean;
  min?: number;
  max?: number;
}

class Validator {
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPassword(password: string): boolean {
    // At least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  static isValidName(name: string): boolean {
    if (!name || name.length < 3 || name.length > 50) {
      return false;
    }
    return true;
  }

  static isValidUsername(username: string): boolean {
    // Alphanumeric characters and underscores, 3-20 characters long
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  }

  /**
   * Thus 3 thing, if number is valid, should you allow user to type and what's the error to be shown
   */
  static isValidNumericInput({
    value,
    decimal = 0, // If decimal = 0, then decimal is not allowed
    required = false,
    max,
    min,
  }: numericInputParam): numericInputReturn {
    const emptyError = required ? "Field cannot be empty" : "";
    if (typeof value == "number") value = value.toString();
    if (typeof value !== "string")
      return { breakInput: true, isValid: false, error: "" };
    const trimmedValue = value.trim();
    if (trimmedValue === "")
      return { breakInput: false, isValid: !required, error: emptyError };
    if (trimmedValue == "-")
      return {
        breakInput: false,
        isValid: false,
        error: "",
      };

    const num = Number(trimmedValue);

    if (Number.isNaN(num))
      return { breakInput: true, isValid: false, error: "" };

    if (Util.isNotNull(max) && Util.isNotNull(min)) {
      if (num < min || num > max)
        return { breakInput: true, isValid: false, error: "" };
    } else if (Util.isNotNull(max)) {
      if (num > max) return { breakInput: true, isValid: false, error: "" };
    } else if (Util.isNotNull(min)) {
      // say min is 5 and person wants to write 10, If I stop him at 1, he wouldn't be able to write thus breakInput: false
      if (num < min)
        return {
          breakInput: false,
          isValid: false,
          error: `Number entered is lower than minimum value ${min}`,
        };
    }

    if (trimmedValue.includes(".")) {
      if (decimal == 0) return { breakInput: true, isValid: false, error: "" };
      const decimalParts = trimmedValue.split(".");
      const integerPart = decimalParts[0];
      const decimalPart = decimalParts[1];

      if (integerPart?.length == 0)
        return { breakInput: true, isValid: false, error: "" };
      if (decimalPart?.length > decimal)
        return { breakInput: true, isValid: false, error: "" };
      if (decimalPart?.length == 0)
        return { breakInput: false, isValid: false, error: "" };
    }

    return { breakInput: false, isValid: true, error: "" };
  }

  /**
   * **From Db** - Check *isValid* else replace to empty
   *
   * **On Change** - Check *breakInput* and return else set *error*
   *
   * **On Submit** - Check *isValid*, if not set *error* or *Invalid Input* and return
   */
  static getNumericValidator({
    decimal = 2,
    required = false,
    min,
    max,
  }: numericInputGeneratorType) {
    return (value: string | number) => {
      return this.isValidNumericInput({ value, required, decimal, max, min });
    };
  }
}

export default Validator;
