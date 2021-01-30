package com.example.changekeeper;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;

import static android.content.Context.MODE_PRIVATE;

public class MainCardFragment extends Fragment {

    ViewGroup thisView;
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        thisView = (ViewGroup) inflater.inflate(
                R.layout.fragment_main_card, container, false);

        //In case the file doesn't exist yet
        boolean found = false;
        for(String i : getActivity().fileList()){
            if(i.equals("UserMoney.txt")){
                found = true;
                break;
            }
        }

        if(!found){
            writeFile();
        }

        //Show Money Values
        readFile();

        ImageView button = (ImageView)thisView.findViewById(R.id.imageView);

        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                ((MainActivity)getActivity()).changeView();
            }
        });

        return thisView;
    }



    public void updateAmount(){
        readFile();
    }

    private void writeFile(){
        try{
            FileOutputStream fileOutputStream = getActivity().openFileOutput("UserMoney.txt",MODE_PRIVATE);
            fileOutputStream.write("0.00\n".getBytes());
            fileOutputStream.write("0.00\n".getBytes());
            fileOutputStream.close();
        }catch(IOException e){
            e.printStackTrace();
        }
    }

    private void readFile() {
        try {
            FileInputStream fileInputStream = getActivity().openFileInput("UserMoney.txt");
            InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream);

            BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

            String walletAmount = bufferedReader.readLine();
            String cardAmount = bufferedReader.readLine();

            TextView cardMoney = this.thisView.findViewById(R.id.cardMoney);
            cardMoney.setText(cardAmount+"€");

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
