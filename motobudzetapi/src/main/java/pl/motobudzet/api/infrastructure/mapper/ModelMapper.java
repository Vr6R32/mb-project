package pl.motobudzet.api.infrastructure.mapper;

import pl.motobudzet.api.domain.model.Model;
import pl.motobudzet.api.domain.model.ModelDTO;

public class ModelMapper {

    private ModelMapper() {
    }

    public static ModelDTO mapToModelDTO(Model model) {
        return ModelDTO.builder()
                .name(model.getName())
                .build();
    }
}
