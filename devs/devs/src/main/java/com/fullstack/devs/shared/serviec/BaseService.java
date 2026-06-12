package com.fullstack.devs.shared.serviec;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public abstract class BaseService<T ,ID> {

    protected abstract JpaRepository<T,ID> getRepository();

    /*devolver el registro*/
    public List<T> findAll(){
        return getRepository().findAll();
    }
    /*buscar registro*/
    public T findById(ID id){
        return getRepository().findById(id).orElseThrow(()-> new RuntimeException("register not found"));
    }
    /*guardar registro*/
    public T save (T entity){
        return getRepository().save(entity);
    }
    /*actualizar registro*/
    public T update (T entity){
        return  getRepository().save(entity);
    }
    /*eliminar registro*/
    public void delete (ID id){
        getRepository().findById(id).orElseThrow(()-> new RuntimeException("register not found" + id));
        getRepository().deleteById(id);
    }
    /*verificar que exite el registro */
    public  boolean exist(ID id){
        return getRepository().existsById(id);
    }


}
