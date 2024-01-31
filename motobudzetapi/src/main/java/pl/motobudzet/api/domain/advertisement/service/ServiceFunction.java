package pl.motobudzet.api.domain.advertisement.service;

@FunctionalInterface
public interface ServiceFunction {
    Object apply(String value);
}