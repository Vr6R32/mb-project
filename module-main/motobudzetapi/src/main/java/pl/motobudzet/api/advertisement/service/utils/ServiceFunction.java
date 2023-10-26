package pl.motobudzet.api.advertisement.service.utils;

@FunctionalInterface
public
interface ServiceFunction {
    Object apply(String value);
}