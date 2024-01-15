package pl.motobudzet.api.advertisement.service;

@FunctionalInterface
public interface ServiceFunction {
    Object apply(String value);
}