const hasMFAMethod = async (populatedUser: any, factor: string) => {
  const mfaExists = (populatedUser.mfamethods as { method: string }[]).some(
    (mfamethods) => mfamethods.method === factor.toLowerCase()
  );

  if (mfaExists) {
    return true;
  } else {
    return false;
  }
};

export default hasMFAMethod;
