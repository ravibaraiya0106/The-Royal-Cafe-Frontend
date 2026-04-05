export const toFormData = (data: Record<string, unknown>) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    const value = data[key];

    // handle arrays
    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(`${key}[]`, item));
    }
    // handle files
    else if (value instanceof File) {
      formData.append(key, value);
    }
    // normal values
    else if (value !== undefined && value !== null) {
      formData.append(key, value as string | Blob);
    }
  });

  return formData;
};
