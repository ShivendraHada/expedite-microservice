type EnvVariables = {
  AWS_REGION: string;
  AWS_ACCESS_KEY: string;
  AWS_SECRET_KEY: string;
};

let envs: EnvVariables | null = null;

const getEnv = (): EnvVariables => {
  if (envs) {
    return envs;
  }

  envs = {
    AWS_REGION: process.env.AWS_REGION || "",
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY || "",
    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY || "",
  };

  const emptyKeys = isAnyKeyEmpty(envs);
  if (emptyKeys.length > 0) {
    throw new Error(`Environment Key Missing: ${emptyKeys.join(", ")}`);
  }

  return envs;
};

const isAnyKeyEmpty = (config: EnvVariables): string[] => {
  const emptyKeys = Object.keys(config).filter((key) => {
    const value = config[key as keyof EnvVariables];
    return value === "" || value === undefined;
  });
  return emptyKeys;
};

export default getEnv;
