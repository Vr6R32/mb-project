package pl.motobudzet.api.domain.model;

import pl.motobudzet.api.persistance.ModelRepository;

public class FactoryModelService {

    private FactoryModelService() {
    }

    public static ModelService createModelService(ModelRepository modelRepository) {
        return new ModelServiceImpl(modelRepository);
    }
}
