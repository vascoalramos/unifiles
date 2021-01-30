package com.example.changekeeper;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Locale;

import static android.support.constraint.Constraints.TAG;

public class CategoryFragment extends Fragment{

    ViewGroup thisView;

    private ArrayList<String> all = new ArrayList<>();
    private ArrayList<String> empty = new ArrayList<>();
    public CategoryScreen catScreen;
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        thisView = (ViewGroup) inflater.inflate(
                R.layout.fragment_category_table, container, false);

        getCategories();

        drawTable();


        return thisView;
    }



    private void drawTable(){
        RecyclerView recyclerView = thisView.findViewById(R.id.infoTable);
        CategoryViewAdapter adapter = null;
        try {
            adapter = new CategoryViewAdapter(this.all, CategoryScreen.info,getActivity());
        } catch (NoSuchFieldException e) {
            e.printStackTrace();
        }
        recyclerView.setAdapter(adapter);
        recyclerView.setLayoutManager(new LinearLayoutManager(getActivity()));
    }

    private void getCategories() {
        try {

            FileInputStream fileInputStream = getActivity().openFileInput("UserCategories.txt");
            InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream);
            BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

            for (int i = 0; i < getResources().getStringArray(R.array.categories).length; i++) {
                all.add(getResources().getStringArray(R.array.categories)[i]);
                Log.i(TAG,"Oi colega " + all.get(i));
            }

            ArrayList<String> tempList = new ArrayList<>();
            String line = "";
            while ((line = bufferedReader.readLine()) != null && line != "\n") {
                all.add(line);
                Log.i(TAG,"Oi colega " + line);
            }


            bufferedReader.close();
            inputStreamReader.close();
            fileInputStream.close();


            this.all.add("Add a new category...");


        } catch (Exception e) {

            for (int i = 0; i < getResources().getStringArray(R.array.categories).length; i++) {
                all.add(getResources().getStringArray(R.array.categories)[i]);
            }
            this.all.add("Add a new category...");

            Log.i(TAG,"Oi colega :)" + this.all.size());

            FileOutputStream fileOutputStream;

            try {
                fileOutputStream = getActivity().openFileOutput("UserCategories.txt", getActivity().MODE_PRIVATE);
                String register = "";
                fileOutputStream.write(register.getBytes());
                fileOutputStream.close();
            } catch (FileNotFoundException e1) {
                e1.printStackTrace();
            } catch (IOException e1) {
                e1.printStackTrace();
            }

        }
    }

    public void updateCategories(String name, String imageName) throws IOException {
        try{
            FileOutputStream fileOutputStream;

            fileOutputStream = getActivity().openFileOutput("UserCategories.txt", getActivity().MODE_APPEND);


            String register = name + " -@OMEGALMAO@- " + imageName+"\n";


            fileOutputStream.write(register.getBytes());
            fileOutputStream.close();
        }catch(IOException e){
            e.printStackTrace();
        }

        Intent intent = new Intent(getContext(), RegExpenseScreen.class);
        Log.i(TAG,"BOIBOIB" + getContext().getClass().toString());
        String[] message = CategoryScreen.info;
        message[3] = name + " -@OMEGALMAO@- " + imageName;
        intent.putExtra(CategoryScreen.EXTRA_MESSAGE, message);
        startActivity(intent);

    }


}
