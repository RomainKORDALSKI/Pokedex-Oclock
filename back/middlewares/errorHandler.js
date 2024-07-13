export const errorHandler = (error, _, res, __) => {
    if(error.statusCode){
      return res.status(error.statusCode).json({ error: error.message});
    }
    res.status(500).json({ 
      error: error.message || "Internal server error. Retry later !", 
    });
  };